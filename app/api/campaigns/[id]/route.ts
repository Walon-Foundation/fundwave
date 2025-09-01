import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/drizzle";
import { campaignTable, commentTable, paymentTable, teamMemberTable, updateTable, userTable } from "../../../../db/schema";
import { eq,asc, sum, count,and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/nodeMailer";
import { supabase } from "@/lib/supabase";

export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>} ){
  try{
    //auth from cookie
    const { userId:clerkId} = await auth()
    if(!clerkId){
      return NextResponse.json({
        ok:false,
        message:"user is not authenticated",
      }, { status:401 })
    }

    const user = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId)).execute())[0]
    if(!user){
      return NextResponse.json({
        ok:false,
        message:"user not found",
      }, { status:400 })
    }

    //the campaign id from the params
    const id  = (await params).id

    //getting the campaign
    const campaign = (await db.select().from(campaignTable).where(eq(campaignTable.id, id)).limit(1).execute())[0]
    if(!campaign){
      return NextResponse.json({
        ok:false,
        message:"invalid campaign id",
      }, { status:400 })
    }

    //Todo: send email to all the donors about the campaign being deleted
    //Todo: add logger to this api route
    await Promise.all([
      await sendEmail("campaign-deleted", user.email, "Campaign has being deleted", { name:user.name }),
      await db.delete(campaignTable).where(eq(campaignTable.id, id)),
      await supabase.storage.from("campaigns").remove([campaign.title])
    ])

    return NextResponse.json({
      message:"Campaign deleted successfully",
    }, { status: 204 })

  }catch(err){
    if (process.env.NODE_ENV === "development") console.log(err)
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Getting the id from the params
    const id = (await params).id;

    // Getting the campaign with that id
    const campaign = (await db.select().from(campaignTable).where(eq(campaignTable.id, id)).limit(1).execute())[0];

    if (!campaign) {
      return NextResponse.json({
        ok: false,
        message: "Campaign not found",
      }, { status: 404 });
    }

    // Getting all related data
    const [updates, comments, teamMembers, payments, creator, creatorCampaigns] = await Promise.all([
      db.select({
        id: updateTable.id,
        title: updateTable.title,
        message: updateTable.message,
        campaignId: updateTable.campaignId,
        image: updateTable.image,
        createdAt: updateTable.createdAt,
        updatedAt: updateTable.updatedAt,
      }).from(updateTable).where(eq(updateTable.campaignId, campaign.id)).execute(),
      
      db.select({
        id: commentTable.id,
        message: commentTable.message,
        username: commentTable.username,
        campaignId: commentTable.campaignId,
        userId: commentTable.userId,
        createdAt: commentTable.createdAt,
        updatedAt: commentTable.updatedAt,
      }).from(commentTable).where(eq(commentTable.campaignId, campaign.id)).execute(),
      
      db.select({
        id: teamMemberTable.id,
        role: teamMemberTable.role,
        name: teamMemberTable.name,
        bio: teamMemberTable.bio,
        campaignId: teamMemberTable.campaignId,
      }).from(teamMemberTable).where(eq(teamMemberTable.campaignId, campaign.id)).execute(),
      
      db.select({
        name: paymentTable.username,
        amount: paymentTable.amount,
        createdAt:paymentTable.createdAt,
      }).from(paymentTable).where(
        and(
          eq(paymentTable.campaignId, campaign.id),
          eq(paymentTable.isCompleted, true)
        )
      ).orderBy(asc(paymentTable.createdAt)).limit(10).execute(),
      
      db.select({
        id: userTable.id,
        name: userTable.name,
        verified: userTable.isVerified,
        profilePicture: userTable.profilePicture,
        location: userTable.district,
      }).from(userTable).where(eq(userTable.id, campaign.creatorId)).limit(1).execute(),
      
      // Get all campaigns by this creator to calculate total raised
      db.select({
        totalRaised: sum(campaignTable.amountReceived),
        count: count(campaignTable.id),
      })
      .from(campaignTable)
      .where(eq(campaignTable.creatorId, campaign.creatorId))
      .execute(),
    ]);

    // Transform the data to match the CampaignDetails interface
    const result = {
      campaign: {
        id: campaign.id,
        title: campaign.title,
        fundingGoal: campaign.fundingGoal,
        amountReceived: campaign.amountReceived,
        location: campaign.location,
        campaignEndDate: campaign.campaignEndDate,
        creatorId: campaign.creatorId,
        creatorName: campaign.creatorName,
        category: campaign.category,
        image: campaign.image,
        shortDescription: campaign.shortDescription,
        problemStatement: campaign.problem,
        solution: campaign.solution,
        impact: campaign.impact,
        campaignType: campaign.campaignType,
        tags: campaign.tags,
        status: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
      },
      updates: updates.map(update => ({
        ...update,
        image: update.image || null,
      })),
      comments,
      teamMembers,
      recentDonors: payments.map(payment => ({
        name: payment.name || null,
        amount: payment.amount,
        time:payment.createdAt
      })),
      creator: {
        id: creator[0]?.id || "",
        name: creator[0]?.name || "",
        verified: creator[0]?.verified || false,
        profilePicture: creator[0]?.profilePicture || "",
        location: creator[0]?.location || "",
        campaignsCreated: creatorCampaigns[0]?.count || 0,
        totalRaised: creatorCampaigns[0]?.totalRaised || 0,
      },
    };

    return NextResponse.json({
      ok: true,
      message: "Campaign details retrieved successfully",
      data: result,
    }, { status: 200 });

  } catch (err) {
    if (process.env.NODE_ENV === "development") console.log(err)
    return NextResponse.json({
      ok: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
