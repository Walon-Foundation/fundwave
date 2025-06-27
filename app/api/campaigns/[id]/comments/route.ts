import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { createComment } from "../../../../../validations/comment";
import { commentTable, userTable } from "../../../../../db/schema";
import { db } from "../../../../../db/drizzle";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";


export async function POST(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  try{
    //auth validation
    const token = (await cookies()).get("accessToken")?.value
    if(!token){
      return NextResponse.json({
        error:"user is not authenticated",
      }, { status:401 })
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id:string}

    const userExist = await db.select().from(userTable).where(eq(userTable.id, user.id)).limit(1)

    if(!user || userExist.length === 0){
      return NextResponse.json({
        error:"invalid auth token",
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

    await db.insert(commentTable).values({
      id:nanoid(16),
      campaignId:id,
      message:data.comment,
      username:userExist[0].name,
      userId:user.id
    })

    return NextResponse.json({
      message:"comment created successfully",
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