import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { campaignTable, userTable, paymentTable, reportTable } from "@/db/schema";
import { count, eq, sum, and, gte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you can implement this based on your admin logic)
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get total campaigns
    const totalCampaigns = await db
      .select({ count: count() })
      .from(campaignTable);

    // Get active campaigns
    const activeCampaigns = await db
      .select({ count: count() })
      .from(campaignTable)
      .where(eq(campaignTable.status, "active"));

    // Get completed campaigns
    const completedCampaigns = await db
      .select({ count: count() })
      .from(campaignTable)
      .where(eq(campaignTable.status, "completed"));

    // Get total users
    const totalUsers = await db
      .select({ count: count() })
      .from(userTable)
      .where(eq(userTable.isDeleted, false));

    // Get verified users (KYC completed)
    const verifiedUsers = await db
      .select({ count: count() })
      .from(userTable)
      .where(and(
        eq(userTable.isKyc, true),
        eq(userTable.isDeleted, false)
      ));

    // Get total donations amount
    const totalDonations = await db
      .select({ total: sum(paymentTable.amount) })
      .from(paymentTable)
      .where(eq(paymentTable.isCompleted, true));

    // Get total donations count
    const totalDonationsCount = await db
      .select({ count: count() })
      .from(paymentTable)
      .where(eq(paymentTable.isCompleted, true));

    // Get pending reports
    const pendingReports = await db
      .select({ count: count() })
      .from(reportTable)
      .where(eq(reportTable.status, "pending"));

    // Get this month's stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await db
      .select({ count: count() })
      .from(userTable)
      .where(and(
        gte(userTable.createdAt, thirtyDaysAgo),
        eq(userTable.isDeleted, false)
      ));

    const newCampaignsThisMonth = await db
      .select({ count: count() })
      .from(campaignTable)
      .where(gte(campaignTable.createdAt, thirtyDaysAgo));

    return NextResponse.json({
      ok: true,
      data: {
        campaigns: {
          total: totalCampaigns[0]?.count || 0,
          active: activeCampaigns[0]?.count || 0,
          completed: completedCampaigns[0]?.count || 0,
          newThisMonth: newCampaignsThisMonth[0]?.count || 0,
        },
        users: {
          total: totalUsers[0]?.count || 0,
          verified: verifiedUsers[0]?.count || 0,
          newThisMonth: newUsersThisMonth[0]?.count || 0,
        },
        donations: {
          totalAmount: totalDonations[0]?.total || 0,
          totalCount: totalDonationsCount[0]?.count || 0,
        },
        reports: {
          pending: pendingReports[0]?.count || 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}