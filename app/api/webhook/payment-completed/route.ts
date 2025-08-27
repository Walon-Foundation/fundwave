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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json(
        {
          ok: false,
          error: "invalid input body",
        },
        { status: 400 }
      );
    }

    const paymentData = data as ConfirmPayment;
    
    if (paymentData.status === "completed") {
      // Get the payment with campaign details
      const payment = await db
        .select({
          payment: paymentTable,
          campaignTitle: campaignTable.title
        })
        .from(paymentTable)
        .leftJoin(campaignTable, eq(paymentTable.campaignId, campaignTable.id))
        .where(eq(paymentTable.monimeId, paymentData.id))
        .limit(1)
        .execute();

      if (payment.length === 0) {
        return NextResponse.json(
          {
            ok: false,
            error: "Payment not found",
          },
          { status: 404 }
        );
      }

      const paymentRecord = payment[0].payment;
      const campaignTitle = payment[0].campaignTitle;

      const queries = [];
      const userEmail = null;
      const  userName = null;

      // Only try to get user details if userId exists and is not null
      if (paymentRecord.userId) {
        const userResult = await db
          .select({ email: userTable.email, name: userTable.name })
          .from(userTable)
          .where(eq(userTable.id, paymentRecord.userId))
          .limit(1)
          .execute();

        if (userResult.length > 0) {
          // userEmail = userResult[0].email;
          // userName = userResult[0].name;

          // Update user's contribution amount only if user exists
          queries.push(
            db
              .update(userTable)
              .set({
                amountContributed: sql`${userTable.amountContributed} + ${paymentRecord.amount}`,
              })
              .where(eq(userTable.id, paymentRecord.userId))
              .execute()
          );
        }
      }

      // Update campaign amount received (always happens)
      queries.push(
        db
          .update(campaignTable)
          .set({
            amountReceived: sql`${campaignTable.amountReceived} + ${paymentRecord.amount}`,
          })
          .where(eq(campaignTable.id, paymentRecord.campaignId))
          .execute()
      );

      // Update payment as completed
      queries.push(
        db
          .update(paymentTable)
          .set({
            isCompleted: true,
          })
          .where(eq(paymentTable.monimeId, paymentData.id))
          .execute()
      );

      // Execute database queries first
      await Promise.all(queries);

      // Send email to donor using email from payment table
      if (paymentRecord.email) {
        try {
          await sendEmail(
            "payment-complete",
            paymentRecord.email,
            "Payment successful",
            { 
              name: paymentRecord.username || "Donor", 
              amount: paymentRecord.amount,
              campaign: campaignTitle as string
            }
          );
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          // Continue execution even if email fails
        }
      }

      // Send notification (handle potential error from sendNotification)
      try {
        await sendNotification(
          `New donation of $${paymentRecord.amount} received`,
          "donations",
          paymentRecord.userId || "", // Can be empty for anonymous
          paymentRecord.campaignId
        );
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
        // Continue execution even if notification fails
      }
    }

    if (process.env.NODE_ENV === "development") console.log("Payment completed")

    return NextResponse.json({
      message: "payment confirmed",
    }, { status: 200 });

  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err)
    return NextResponse.json(
      {
        ok: false,
        error: "internal server error",
      },
      { status: 500 }
    );
  }
}