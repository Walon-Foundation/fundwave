import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userTable, campaignTable, paymentTable } from "@/db/schema";
import { sql, eq } from "drizzle-orm";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range") || "30d";
    const days = parseInt(rangeParam.replace("d", "")) || 30;
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Overview metrics
    const [userCountRes] = await db.select({ count: sql<number>`count(*)` }).from(userTable);
    const totalUsers = Number(userCountRes.count);

    const [campaignCountRes] = await db.select({ count: sql<number>`count(*)` }).from(campaignTable);
    const totalCampaigns = Number(campaignCountRes.count);

    const [raisedRes] = await db
      .select({ totalRaised: sql<number>`sum(${paymentTable.amount})` })
      .from(paymentTable)
      .where(eq(paymentTable.isCompleted, true));
    const totalRaised = Number(raisedRes.totalRaised) || 0;

    const [activeCampaignsRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaignTable)
      .where(eq(campaignTable.status, 'active'));
    const activeCampaigns = Number(activeCampaignsRes.count);

    return NextResponse.json({
      overview: { totalUsers, totalCampaigns, totalRaised, activeCampaigns },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

