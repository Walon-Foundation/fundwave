import { NextResponse,NextRequest } from "next/server"
import { db } from "../../../../../db/drizzle"
import { campaignTable, updateTable, userTable } from "../../../../../db/schema"
import { and, eq } from "drizzle-orm"
import { createUpdate } from "../../../../../validations/update"
import { nanoid } from "nanoid"
import { auth } from "@clerk/nextjs/server"

export async function POST(req:NextRequest, {params}:{params:Promise<{id:string}>}) {
  try{
    //auth checking
    const { userId } = await auth()
    const user = (await db.select().from(userTable).where(eq(userTable.clerkId, userId as string)).limit(1))[0]

    if(!userId || !user){
      return NextResponse.json({
        ok:false,
        message:"user is not authenticated",
      }, { status: 401 })
    }

    const id = (await params).id

    const campaign = await db.select().from(campaignTable).where(and(eq(campaignTable.id, id), eq(campaignTable.creatorId, user.id))).limit(1)

    if(!user || campaign.length === 0){
      return NextResponse.json({
        error:"user is not the campaign creator",
      }, { status:401 })
    }

    const body = await req.formData()
    const title = body.get("title")
    const content = body.get("content")
    // const image = body.get("image") as File

    const {data, success, error} = createUpdate.safeParse({
      title,
      content
    })

    if(!success){
      return NextResponse.json({
        message:"invalid input fields",
        error:error.format()
      }, { status:400 })
    }

    const newUpdate = (await db.insert(updateTable).values({
      id:nanoid(16),
      title:data.title,
      message:data.content,
      campaignId:id,
    }).returning().execute())[0]

    return NextResponse.json({
      ok:true,
      message:"update created successfully",
      data:newUpdate
    }, { status:201 })

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      error:"internal server error",
    }, {status:500 })
  }
}


export async function GET(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  try{
    const id = (await params).id
    const allUpdates = await db.select().from(updateTable).where(eq(updateTable.campaignId, id))

    if(allUpdates.length === 0 ){
      return NextResponse.json({
        message:"not updates at yet",
        data:[]
      }, { status:200 })
    }

    return NextResponse.json({
      message:"all updates",
      data:{
        update:allUpdates
      }
    }, {status:200})
    
  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}

