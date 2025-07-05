import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import {
  userTable,
  campaignTable,
  paymentTable,
  logTable,
} from "@/db/schema";
import { count, sum, desc, gte, lte, and, eq } from "drizzle-orm";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    // Stats
    const [totalUsersRes] = await db.select({ value: count() }).from(userTable);
    const [newUsersTodayRes] = await db
      .select({ value: count() })
      .from(userTable)
      .where(gte(userTable.createdAt, today));
    const [totalCampaignsRes] = await db
      .select({ value: count() })
      .from(campaignTable);
    const [activeCampaignsRes] = await db
      .select({ value: count() })
      .from(campaignTable)
      .where(eq(campaignTable.status, "active"));
    const [pendingCampaignsRes] = await db
      .select({ value: count() })
      .from(campaignTable)
      .where(eq(campaignTable.status, "pending"));
    const [totalRaisedRes] = await db
      .select({ value: sum(campaignTable.amountReceived) })
      .from(campaignTable);
    const [todaysDonationsRes] = await db
      .select({ value: sum(paymentTable.amount) })
      .from(paymentTable)
      .where(gte(paymentTable.createdAt, today));

    const totalRaised = Number(totalRaisedRes.value) || 0;
    const platformFees = totalRaised * 0.05; // Assuming 5% platform fee

    const stats = {
      totalUsers: totalUsersRes.value,
      newUsersToday: newUsersTodayRes.value,
      totalCampaigns: totalCampaignsRes.value,
      activeCampaigns: activeCampaignsRes.value,
      pendingCampaigns: pendingCampaignsRes.value,
      totalRaised: totalRaised,
      todaysDonations: Number(todaysDonationsRes.value) || 0,
      platformFees: platformFees,
    };

    // Recent Activity
    const recentLogs = await db
      .select()
      .from(logTable)
      .orderBy(desc(logTable.timestamp))
      .limit(5);

    const recentActivity = recentLogs.map((log) => ({
      id: log.id,
      type: log.category,
      message: log.details,
      timestamp: log.timestamp.toISOString(),
    }));

    // Alerts
    const [pendingCampaignsAlertRes] = await db
      .select({ value: count() })
      .from(campaignTable)
      .where(
        and(
          eq(campaignTable.status, "pending"),
          lte(campaignTable.createdAt, fortyEightHoursAgo)
        )
      );
    
    const alerts = [];
    if (pendingCampaignsAlertRes.value > 0) {
      alerts.push({
        id: "alert_pending_campaigns",
        type: "warning",
        message: `${pendingCampaignsAlertRes.value} campaigns pending approval for over 48 hours`,
        priority: "medium",
      });
    }

    return NextResponse.json({
      stats,
      recentActivity,
      alerts,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

