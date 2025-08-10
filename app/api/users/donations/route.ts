import { db } from "@/db/drizzle"
import { campaignTable, paymentTable, userTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq, inArray, } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req:NextRequest){
  try{
    //getting the user clerkId
    const { userId:clerkId } = await auth()
    if(!clerkId){
      return NextResponse.json({
        ok:false,
        message:"user is not authenticated",
      }, { status:401 })
    }

    //getting the user from the database
    const userId = (await db.select({ userId: userTable.id}).from(userTable).where(eq(userTable.clerkId,clerkId)).limit(1).execute())[0]
    if(!userId){
      return NextResponse.json({
        ok:false,
        message:"user not found",
      }, {status:400})
    }

    //getting the campaignId
    const campaignIds = await db.selectDistinct({campaignId:paymentTable.campaignId}).from(paymentTable).where(eq(paymentTable.userId, userId.userId))

    if(campaignIds.length === 0){
      return NextResponse.json({
        ok:true,
        message:"no donation for this user at yet",
      }, { status: 200 })
    }

    const campaignDetails = await db.select().from(campaignTable).where(inArray(campaignTable.id, campaignIds.map(c => c.campaignId))).execute()

    return NextResponse.json({
      ok:true,
      message:"all donation made by the user",
      data:campaignDetails
    }, { status:200 })
  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      ok:false,
      message:"internal server error",
    }, { status:500 })
  }
}