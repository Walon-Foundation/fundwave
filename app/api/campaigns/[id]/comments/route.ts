import { NextRequest, NextResponse } from "next/server";
import { createComment } from "../../../../../validations/comment";
import { commentTable, userTable } from "../../../../../db/schema";
import { db } from "../../../../../db/drizzle";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { sendNotification } from "@/lib/notification";


export async function POST(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  try{
    //auth validation
    const { userId } = await auth()
    const userExist = await db.select().from(userTable).where(eq(userTable.clerkId, userId as string)).limit(1)

    if(!userId || userExist.length === 0){
      return NextResponse.json({
        error:"user not authenticated",
      }, { status:401 })
    }
    
    const body = await req.json()

    const { error, success, data} = createComment.safeParse(body)
    if(!success){
      return NextResponse.json({
        message:"invalid input field",
        error:error.format()
      }, {status:400})
    }


    const id = (await params).id

    const newComment = (await db.insert(commentTable).values({
      id:nanoid(16),
      campaignId:id,
      message:data.comment,
      username:userExist[0].name,
      userId:userExist[0].id
    }).returning().execute())[0]


      //sending the notification about the new comment created
    await sendNotification("New comment", "comment", userExist[0].id, id)

    return NextResponse.json({
      message:"comment created successfully",
      data: newComment
    }, { status:201 })

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err): ""
    return NextResponse.json({
      error:"internal server error",
    }, {status:500 })
  }
}

export async function GET(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  try{
    const id = (await params).id
    const allComments = await db.select().from(commentTable).where(eq(commentTable.campaignId, id))

    if(allComments.length === 0){
      return NextResponse.json({
        message:"no comment for this campaign at yet",
        data:[],
      }, {status:200})
    }

    return NextResponse.json({
      message:"all comment for this campaign",
      data:{
        comment:allComments,
      }
    }, { status:200 })
  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err): ""
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}