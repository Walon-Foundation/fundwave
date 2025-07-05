import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { paymentTable, campaignTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const donations = await db
      .select({
        id: paymentTable.id,
        campaignId: paymentTable.campaignId,
        campaignTitle: campaignTable.title,
        amount: paymentTable.amount,
        currency: sql<string>`'SLL'`.as("currency"),
        status: paymentTable.isCompleted,
        transactionId: paymentTable.monimeId,
        createdAt: paymentTable.createdAt,
      })
      .from(paymentTable)
      .leftJoin(campaignTable, eq(paymentTable.campaignId, campaignTable.id))
      .where(eq(paymentTable.userId, userId));

    const totalDonated = donations.reduce((sum, d) => sum + Number(d.amount), 0);
    const totalCampaigns = new Set(donations.map((d) => d.campaignId)).size;
    const averageDonation = donations.length > 0 ? totalDonated / donations.length : 0;

    return NextResponse.json({
      donations,
      summary: {
        totalDonated,
        totalCampaigns,
        averageDonation,
      },
    });
  } catch (error) {
    console.error(`Error fetching donations for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

