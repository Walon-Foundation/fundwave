import { db } from "@/db/drizzle";
import { campaignTable, paymentTable, userTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { countDistinct, eq, sum } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { CombinedUserData, UserCampaign, UserDonation } from "@/types/api";

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        {
          ok: false,
          message: "User is not authenticated",
        },
        { status: 401 }
      );
    }

    // Get user basic info
    const user = (
      await db.select().from(userTable).where(eq(userTable.clerkId, clerkId))
    ).at(0);

    if (!user) {
      process.env.NODE_ENV === "development" ? console.log("User not found") : "";
      return NextResponse.json(
        {
          ok: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Split name into first and last name
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Fetch all data in parallel
    const [
      totalRaisedResult,
      campaignsStartedResult,
      donationsMadeResult,
      userCampaigns,
      userDonations,
    ] = await Promise.all([
      // Stats
      db
        .select({ totalRaised: sum(campaignTable.amountReceived) })
        .from(campaignTable)
        .where(eq(campaignTable.creatorId, user.id)),
      db
        .select({ campaignsStarted: countDistinct(campaignTable.id) })
        .from(campaignTable)
        .where(eq(campaignTable.creatorId, user.id)),
      db
        .select({ donationsMade: countDistinct(paymentTable.id) })
        .from(paymentTable)
        .where(eq(paymentTable.userId, user.id)),

      // Campaigns
      db
        .select({
          id: campaignTable.id,
          title: campaignTable.title,
          status: campaignTable.status,
          amountRaised: campaignTable.amountReceived,
          targetAmount: campaignTable.fundingGoal,
          createdAt: campaignTable.createdAt,
          endDate: campaignTable.campaignEndDate,
        })
        .from(campaignTable)
        .where(eq(campaignTable.creatorId, user.id)),

      // Donations
      db
        .select({
          id: paymentTable.id,
          campaignId: paymentTable.campaignId,
          campaignTitle: campaignTable.title,
          amount: paymentTable.amount,
          date: paymentTable.createdAt,
          status: paymentTable.isCompleted,
          message: paymentTable.monimeId,
        })
        .from(paymentTable)
        .leftJoin(campaignTable, eq(paymentTable.campaignId, campaignTable.id))
        .where(eq(paymentTable.userId, user.id)),
    ]);

    // Extract stats
    const totalRaised = totalRaisedResult[0]?.totalRaised || 0;
    const campaignsStarted = campaignsStartedResult[0]?.campaignsStarted || 0;
    const donationsMade = donationsMadeResult[0]?.donationsMade || 0;

    // Format campaigns
    const formattedCampaigns: UserCampaign[] = userCampaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      status: campaign.status as "active" | "completed" | "paused" | "cancelled",
      amountRaised: Number(campaign.amountRaised),
      targetAmount: Number(campaign.targetAmount),
      progress: Math.min(
        100,
        Math.round((Number(campaign.amountRaised) / Number(campaign.targetAmount)) * 100)
      ),
      createdAt: campaign.createdAt.toISOString(),
      endDate: campaign.endDate?.toISOString(),
    }));

    // Format donations
    const formattedDonations: UserDonation[] = userDonations.map((donation) => ({
      id: donation.id,
      campaignId: donation.campaignId,
      campaignTitle: donation.campaignTitle || "Unknown Campaign",
      amount: Number(donation.amount),
      date: donation.date.toISOString(),
      status: donation.status ? "completed" : "pending",
      message: donation.message || undefined,
    }));

    // Construct the complete response
    const response: CombinedUserData = {
      profile: {
        id: user.id,
        firstName,
        lastName,
        username: user.email.split("@")[0],
        email: user.email,
        phone: user.phone || undefined,
        bio: user.bio || undefined,
        location: user.district || undefined,
        profilePicture: user.profilePicture || undefined,
        joinDate: user.createdAt.toISOString(),
        isVerified: user.isVerified,
        totalDonated: user.amountContributed,
        campaignsStarted,
        donationsMade,
        totalRaised: Number(totalRaised),
      },
      campaigns: formattedCampaigns,
      donations: formattedDonations,
      stats: {
        campaignsStarted,
        donationsMade,
        totalRaised: Number(totalRaised),
        totalDonated: user.amountContributed,
      },
    };

    return NextResponse.json(
      {
        ok: true,
        message: "User data fetched successfully",
        data: response,
      },
      { status: 200 }
    );
  } catch (err) {
    process.env.NODE_ENV === "development" ? console.log(err) : "";
    return NextResponse.json(
      {
        ok: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req:NextRequest){
  try{
    const { userId:clerkId } = await auth()
    const user = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId!)).limit(1).execute())[0]

    if(!clerkId || !user){
      return NextResponse.json({
        ok:false,
        message:"user is not authenticated",
      }, { status:401 })
    }

    //deleting the user from the database
    await db.delete(userTable).where(eq(userTable.clerkId, clerkId!)).execute()

    return NextResponse.json({
      ok:true,
      message:"user deleted",
    }, { status:204 })

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err) : ""
    return NextResponse.json({
      ok:false,
      message:"internal server error",
    }, { status:500 })
  }
}

