import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { paymentTable, campaignTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Assuming a payload structure from a provider like Paystack
    // You should add signature verification in a real app
    if (payload.event === "charge.success") {
      const reference = payload.data.reference;

      const [payment] = await db
        .select()
        .from(paymentTable)
        .where(eq(paymentTable.monimeId, reference));

      if (payment && !payment.isCompleted) {
        // Mark payment as completed
        await db
          .update(paymentTable)
          .set({ isCompleted: true })
          .where(eq(paymentTable.id, payment.id));

        // Update campaign's total amount received
        await db
          .update(campaignTable)
          .set({
            amountReceived: sql`${campaignTable.amountReceived} + ${payment.amount}`,
          })
          .where(eq(campaignTable.id, payment.campaignId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return new NextResponse("Webhook processing failed", { status: 400 });
  }
}

