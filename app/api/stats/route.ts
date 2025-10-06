import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { campaignTable, paymentTable } from "@/db/schema";
import { and, eq, sql, count, sum } from "drizzle-orm";

export async function GET() {
  try {
    // Aggregate counts and sums
    const [campaignsCountRow] = await db
      .select({ total: count(campaignTable.id) })
      .from(campaignTable);

    const [completedCampaignsRow] = await db
      .select({ total: count(campaignTable.id) })
      .from(campaignTable)
      .where(eq(campaignTable.status, "completed"));

    const [totalRaisedRow] = await db
      .select({ total: sum(campaignTable.amountReceived) })
      .from(campaignTable);

    const [donorsCountRow] = await db
      .select({ total: sql<number>`COUNT(DISTINCT ${paymentTable.userId})` })
      .from(paymentTable);

    const totalCampaigns = Number(campaignsCountRow?.total ?? 0);
    const completedCampaigns = Number(completedCampaignsRow?.total ?? 0);
    const totalRaised = Number(totalRaisedRow?.total ?? 0);
    const donorsCount = Number(donorsCountRow?.total ?? 0);

    const successRate = totalCampaigns > 0 ? (completedCampaigns / totalCampaigns) * 100 : 0;

    return NextResponse.json(
      {
        ok: true,
        data: {
          successfulCampaigns: completedCampaigns,
          raised: totalRaised,
          happyDonors: donorsCount,
          successRate,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("/api/stats error", error);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
