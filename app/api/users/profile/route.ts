import { db } from "@/db/drizzle"
import { campaignTable, paymentTable, userTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { countDistinct, eq, sum } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req:NextRequest){
  try{
    //getting the user clerk id
    const { userId:clerkId } = await auth()
    if(!clerkId){
      return NextResponse.json({
        ok:false,
        message:"users is not authenticated"
      }, { status:401 })
    }

    const user = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1).execute())[0]

    if(!user){
      process.env.NODE_ENV === "development" ? console.log("user not found") : ""
      return NextResponse.json({
        ok:false,
        message:"user not found"
      }, { status:400 })
    }

    //getting the other details
    const [totalRaised, campaignCreated, campaignSupported] = await Promise.all([
      (await db.select({totalRaised: sum(campaignTable.amountReceived).as("totalRaised")}).from(campaignTable).where(eq(campaignTable.creatorId, user.id)))[0],
      (await db.select({campaignCreated:countDistinct(campaignTable.id).as("campaignCreated")}).from(campaignTable).where(eq(campaignTable.creatorId, user.id)))[0],
      (await db.select({campaignSupported: countDistinct(paymentTable.campaignId).as("campaignSupported")}).from(paymentTable).where(eq(paymentTable.userId, user.id)))[0]
    ])

    return NextResponse.json({
      ok:true,
      message:"User profile details",
      data:{
        name:user.name,
        email:user.email,
        totalDonated:user.amountContributed,
        createdAt:user.createdAt,
        phone:user.phone,
        profile_pic:user.profilePicture,
        isVerified:user.isVerified,
        campaignCreated,
        totalRaised,
        campaignSupported
      }
    }, { status:200 })
  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      ok:false,
      message:"internal server error"
    }, { status:500 })
  }
}