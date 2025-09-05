import { NextResponse, NextRequest } from "next/server";
import { ConfirmPayment } from "@/types/monimeTypes";
import { db } from "@/db/drizzle";
import {
  campaignTable,
  paymentTable,
  userTable,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/nodeMailer";
import { sendNotification } from "@/lib/notification";
import axios from "axios";
import { FinancialAccount } from "@/lib/monime";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { ok: false, message: "body not found" },
        { status: 400 }
      );
    }

    const paymentData = body as ConfirmPayment;

    if (paymentData.data.status === "completed") {
      // Get payment record
      const payment = (
        await db
          .select()
          .from(paymentTable)
          .where(eq(paymentTable.monimeId, paymentData.data.id))
          .limit(1)
          .execute()
      )[0];

      if (payment.isCompleted){
        return NextResponse.json({
          ok:true,
        }, { status:200 })
      }

      // Get campaign record
      const campaign = (
        await db
          .select({ title: campaignTable.title, financialId:campaignTable.financialAccountId })
          .from(campaignTable)
          .where(eq(campaignTable.id, payment.campaignId as string))
          .limit(1)
          .execute()
      )[0];

      if (!payment || !campaign) {
        return NextResponse.json(
          { ok: false, message: "payment not found" },
          { status: 400 }
        );
      }

      //fetch the account details from the monime to get the real amount
      const account = await FinancialAccount(campaign.financialId as string)
      if(account?.success){
        await db
            .update(campaignTable)
            .set({
              amountReceived: sql`${campaignTable.amountReceived} + ${(account.result.amount.value) / 100}`,
            })
            .where(eq(campaignTable.id, payment.campaignId))
      }

      // update amount
      const amount = (paymentData.data.amount.value) / 100

      if (payment.username !== "Anonymous") {
        await Promise.all([
          // mark payment as completed
          db
            .update(paymentTable)
            .set({ isCompleted: true })
            .where(eq(paymentTable.monimeId, paymentData.data.id)),

          // increment user amount
          db
            .update(userTable)
            .set({
              amountContributed: sql`${userTable.amountContributed} + ${amount}`,
            })
            .where(eq(userTable.id, payment.userId as string)),

          // send notifications
          sendEmail(
            "payment-complete",
            payment.email,
            "Payment Completed Successfully",
            {
              name: payment.username as string,
              amount,
              campaign: campaign.title,
            }
          ),
          sendNotification(
            "Donnation made",
            "donations",
            payment.userId as string,
            payment.campaignId as string
          ),
        ]);
      } else {
        await Promise.all([
          db
            .update(paymentTable)
            .set({ isCompleted: true })
            .where(eq(paymentTable.monimeId, paymentData.data.id)),

          sendEmail(
            "payment-complete",
            payment.email,
            "Payment Completed Successfully",
            {
              name: payment.username as string,
              amount,
              campaign: campaign.title,
            }
          ),
          sendNotification(
            "Donnation made",
            "donations",
            payment.userId as string,
            payment.campaignId as string
          ),
        ]);
      }
    } else {
      return NextResponse.json(
        { ok: false, message: "invalid webhook" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: true},
      { status: 200 }
    );
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err);
    return NextResponse.json(
      { ok: false, message: "internal server error" },
      { status: 500 }
    );
  }
}
