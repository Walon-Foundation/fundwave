import { db } from "@/db/drizzle"
import { campaignTable, paymentTable, userTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
  
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({
        ok: false,
        message: "User is not authenticated",
      }, { status: 401 })
    }


    const userRecord = await db
      .select({ userId: userTable.id })
      .from(userTable)
      .where(eq(userTable.clerkId, clerkId))
      .limit(1)
      .execute()

    if (!userRecord.length) {
      return NextResponse.json({
        ok: false,
        message: "User not found",
      }, { status: 400 })
    }

    const userId = userRecord[0].userId

  
    const campaignDonations = await db
      .select({
        campaignId: paymentTable.campaignId,
        totalDonated: sql<number>`SUM(${paymentTable.amount})`.as("totalDonated"),
        date: paymentTable.createdAt
      })
      .from(paymentTable)
      .where(eq(paymentTable.userId, userId))
      .groupBy(paymentTable.campaignId)
      .execute()

    if (campaignDonations.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "No donations for this user yet",
        data: [],
      }, { status: 200 })
    }

    
    const campaignIds = campaignDonations.map(c => c.campaignId)
    const campaignDetails = await db
      .select()
      .from(campaignTable)
      .where(sql`${campaignTable.id} IN (${sql.join(campaignIds)})`)
      .execute()

    const result = campaignDetails.map(campaign => {
      const donationInfo = campaignDonations.find(d => d.campaignId === campaign.id)
      return {
        ...campaign,
        totalDonated: donationInfo?.totalDonated || 0,
        paymentDate:donationInfo?.date
      }
    })

    return NextResponse.json({
      ok: true,
      message: "All campaigns the user has donated to",
      data: result,
    }, { status: 200 })

  } catch (err) {
    process.env.NODE_ENV === "development" && console.error(err)
    return NextResponse.json({
      ok: false,
      message: "Internal server error",
    }, { status: 500 })
  }
}
