import { db } from "@/db/drizzle"
import { campaignTable, userTable } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req:NextRequest){
  try{
    //getting the user clerk id
    const { userId:clerkId } = await auth()
    if(!clerkId){
      return NextResponse.json({
        ok:false,
        message:"user is not authenticated",
      }, { status:401 })
    }

    //getting the userId
    const userId = (await db.select({ userId: userTable.id}).from(userTable).where(eq(userTable.clerkId, clerkId)).execute())[0]
    if(!userId){
      return NextResponse.json({
        ok:false,
        message:"user not found",
      }, { status:400 })
    }

    //getting the campaign created by the users
    const campaigns = await db.select().from(campaignTable).where(eq(campaignTable.creatorId, userId.userId)).execute()
    if(campaigns.length === 0){
      return NextResponse.json({
        ok:true,
        message:"no campaign created by the user yet",
        data:[]
      }, { status:200 })
    }

    return NextResponse.json({
      ok:true,
      message:"all user created campiagn",
      data: campaigns
    }, { status:200 })
  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      ok:false,
      message:"internal server error",
    }, { status:500 })
  }
}