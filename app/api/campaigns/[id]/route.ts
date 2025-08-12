import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/drizzle";
import { campaignTable, commentTable, paymentTable, teamMemberTable, updateTable, userTable } from "../../../../db/schema";
import { eq,asc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { sendEmail } from "@/lib/nodeMailer";

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

    //Todo: send email to all the donors about the campaign being deleted
    //Todo: add logger to this api route
    await Promise.all([
      await sendEmail("campaign-deleted", user.email, "Campaign has being deleted", { name:user.name }),
      await db.delete(campaignTable).where(eq(campaignTable.id, id))
    ])

    return NextResponse.json({
      message:"Campaign deleted successfully",
    }, { status: 204 })

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}


export async function GET(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  try{
    //getting the id from the params
    const id = (await params).id

    //getting the campaign with that id
    const campaign = (await db.select().from(campaignTable).where(eq(campaignTable.id, id)).limit(1).execute())[0]

    if(!campaign){
      return NextResponse.json({
        ok:false,
        message:"campaign not found",
      }, { status:400 })
    }

    //getting the team member, updare,comments,
    const [updates,comments,teamMembers, recentDonors] = await Promise.all([
      await db.select().from(updateTable).where(eq(updateTable.campaignId, campaign.id)).execute(),
      await db.select().from(commentTable).where(eq(commentTable.campaignId, campaign.id)).execute(),
      await db.select().from(teamMemberTable).where(eq(teamMemberTable.campaignId, campaign.id)).execute(),
      await db.select({
        name:paymentTable.username,
        ammount:paymentTable.amount
      }).from(paymentTable).where(eq(paymentTable.campaignId, campaign.id)).orderBy(asc(paymentTable.createdAt)).limit(10).execute()
    ])

    if(!campaign){
      return NextResponse.json({
        ok:false,
        message:"campaign not found"
      }, { status:400 })
    }

    const result = {
      campaign,
      updates,
      comments,
      teamMembers,
      recentDonors
    }

    return NextResponse.json({
      ok:true,
      message:"campaign details",
      data:result
    }, { status:200 })
  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err) : ""
    return NextResponse.json({
      ok:false,
      message:"internal server error",
    }, { status:500 })
  }
}