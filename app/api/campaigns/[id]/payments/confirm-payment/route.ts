import { NextResponse, NextRequest } from "next/server";
import { ConfirmPayment } from "../../../../../../types/monimeTypes";
import { db } from "../../../../../../db/drizzle";
import {
  campaignTable,
  paymentTable,
  userTable,
} from "../../../../../../db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data) {
      return NextResponse.json(
        {
          error: "invalid input body",
        },
        { status: 500 }
      );
    }

    const paymentData = data as ConfirmPayment;
    if (paymentData.status === "completed") {
      const payment = await db
        .select()
        .from(paymentTable)
        .where(eq(paymentTable.monimeId, paymentData.id))
        .limit(1)
        .execute();
      const queries = [];

      if (payment[0].userId) {
        queries.push(
          db
            .update(userTable)
            .set({
              amountContributed: sql`${userTable.amountContributed} + ${payment[0].amount}`,
            })
            .where(eq(userTable.id, payment[0].userId))
            .execute()
        );
      }

      queries.push(
        db
          .update(campaignTable)
          .set({
            amountReceived: sql`${campaignTable.amountReceived} + ${payment[0].amount}`,
          })
          .where(eq(campaignTable.id, payment[0].campaignId))
          .execute()
      );

      await Promise.all(queries);
    }

    return NextResponse.json({
        message:"payment cofirm",
    },{ status:200 })

  } catch (err) {
    process.env.NODE_ENV === "development" ? console.log(err) : "";
    return NextResponse.json(
      {
        error: "internal server error",
      },
      { status: 500 }
    );
  }
}
