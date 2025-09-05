import { NextResponse, NextRequest } from "next/server";
import { ConfirmPayment } from "@/types/monimeTypes";
import { db } from "@/db/drizzle";
import { campaignTable, userTable, withdrawalTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/nodeMailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { ok: false, message: "body not found" },
        { status: 400 }
      );
    }

    const withdrawData = body as ConfirmPayment;

    if (withdrawData.data.status === "completed") {
      // Get payment record
      const withdraw = (await db.select().from(withdrawalTable).where(eq(withdrawalTable.monime_id, withdrawData.data.id)).limit(1).execute())[0]
      const user = (await db.select().from(userTable).where(eq(userTable.id, withdraw.userId)).limit(1).execute())[0]

      if (withdraw.status === "completed") {
        return NextResponse.json(
          {
            ok: true,
          },
          { status: 200 }
        );
      }

      // Get campaign record
      const campaign = (
        await db
          .select({ title: campaignTable.title })
          .from(campaignTable)
          .where(eq(campaignTable.id, withdraw.campaignId as string))
          .limit(1)
          .execute()
      )[0];

      if (!withdraw || !campaign) {
        return NextResponse.json(
          { ok: false, message: "withdraw not found" },
          { status: 400 }
        );
      }

      // update amount
      const amount = withdrawData.data.amount.value / 100;

      //mark the withdraw as complete, change the value on the amount recieved and send the email

      await Promise.all([
        db.update(withdrawalTable).set({status:"completed"}).where(eq(withdrawalTable.monime_id, withdrawData.data.id)),
        db.update(campaignTable).set({amountReceived: sql`${campaignTable.amountReceived} - ${amount}`}).where(eq(campaignTable.id, withdraw.campaignId)),
        sendEmail("payout-sent", user.email, "Withdrawal was successfull", {
          name: user.name,
          amount: amount,
        })
      ])

    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err);
    return NextResponse.json(
      { ok: false, message: "internal server error" },
      { status: 500 }
    );
  }
}


