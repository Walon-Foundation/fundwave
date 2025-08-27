import { db } from "@/db/drizzle"
import { campaignTable, commentTable, notificationTable, paymentTable, userTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq, inArray, sum, countDistinct, desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the logged-in Clerk user ID
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json(
        { ok: false, message: "User is not authenticated" },
        { status: 401 }
      )
    }

    // Get the user ID from your database
    const userInfo = (
      await db
        .select({ userId: userTable.id })
        .from(userTable)
        .where(eq(userTable.clerkId, clerkId))
        .limit(1)
        .execute()
    )[0]

    if (!userInfo) {
      return NextResponse.json(
        { ok: false, message: "User doesn't exist" },
        { status: 400 }
      )
    }

    const userId = userInfo.userId

    // Get all campaigns created by this user
    const campaigns = await db
      .select({
        id: campaignTable.id,
        name: campaignTable.title,
        status: campaignTable.status,
        createdAt: campaignTable.createdAt,
        amountNeeded: campaignTable.fundingGoal,
        donated: campaignTable.amountReceived,
        endDate: campaignTable.campaignEndDate,
      })
      .from(campaignTable)
      .where(eq(campaignTable.creatorId, userId))
      .execute()

    if (campaigns.length === 0) {
      return NextResponse.json(
        { ok: true, message: "User hasn't created any campaigns", data: {} },
        { status: 200 }
      )
    }

    const campaignIds = campaigns.map(c => c.id)

    // Fetch aggregated data
    const [commentsPerCampaign, donorsPerCampaign, totalDonors, totalRaised, notifications] =
      await Promise.all([
        // Total comments per campaign
        db
          .select({
            campaignId: commentTable.campaignId,
            totalComments: countDistinct(commentTable.id),
          })
          .from(commentTable)
          .where(inArray(commentTable.campaignId, campaignIds))
          .groupBy(commentTable.campaignId),

        // Total donors per campaign (unique donors)
        db
          .select({
            campaignId: paymentTable.campaignId,
            totalDonors: countDistinct(paymentTable.userId),
          })
          .from(paymentTable)
          .where(inArray(paymentTable.campaignId, campaignIds))
          .groupBy(paymentTable.campaignId),

        // Total donors for all campaigns (unique donors)
        db
          .select({
            totalDonors: countDistinct(paymentTable.userId),
          })
          .from(paymentTable)
          .where(inArray(paymentTable.campaignId, campaignIds)),

        // Total raised from all campaigns
        db
          .select({
            totalRaised: sum(campaignTable.amountReceived),
          })
          .from(campaignTable)
          .where(inArray(campaignTable.id, campaignIds)),

        // Notifications (recent activities)
        db
          .select()
          .from(notificationTable)
          .where(inArray(notificationTable.campaignId, campaignIds))
          .orderBy(desc(notificationTable.createdAt))
          .limit(10),
      ])

    // Merge per-campaign stats into campaign objects
    const campaignsWithStats = campaigns.map(campaign => {
      const comments = commentsPerCampaign.find(cc => cc.campaignId === campaign.id)?.totalComments || 0
      const donors = donorsPerCampaign.find(dc => dc.campaignId === campaign.id)?.totalDonors || 0
      return {
        ...campaign,
        totalComments: comments,
        totalDonors: donors,
      }
    })

    return NextResponse.json(
      {
        ok: true,
        message: "User dashboard details",
        data: {
          campaigns: campaignsWithStats,
          totalDonors: totalDonors[0]?.totalDonors || 0,
          totalRaised: totalRaised[0]?.totalRaised || 0,
          notifications,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err)
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
