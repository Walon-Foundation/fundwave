import { NextResponse,NextRequest } from "next/server"
import { db } from "@/db/drizzle"
import { campaignTable, updateTable, userTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { createUpdate } from "@/validations/update"
import { nanoid } from "nanoid"
import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { logEvent } from "@/lib/logging"

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

    const campaign = (await db.select().from(campaignTable).where(and(eq(campaignTable.id, id), eq(campaignTable.creatorId, user.id))).limit(1).execute())[0]

    if(!user || !campaign){
      return NextResponse.json({
        error:"user is not the campaign creator",
      }, { status:401 })
    }

    const body = await req.formData()
    const title = body.get("title")
    const content = body.get("content")
    const image = body.get("image") as File

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

    let signedUrl = ""

    if(image){
       if(image.size > 50 * 1024 * 1024){
        return NextResponse.json({
          ok:false,
          message:"image is large than 50mb"
        }, { status:400 })
      }

      const FILEPATH = data?.title as string
      const buffer = Buffer.from(await image.arrayBuffer())

      const { error:uploadError } = await supabase.storage.from("updates").upload(FILEPATH, buffer, {
        contentType:image.type,
        upsert:true
      })

      if (uploadError){
        return NextResponse.json({
          ok:false,
          message:"failed to upload the update image"
        }, { status: 500})
      }

      const { data:updateSignedUrlData } = await supabase.storage.from("updates").createSignedUrl(FILEPATH, 60 * 60 * 24 * 356 * 2)
      if(!updateSignedUrlData){
        return NextResponse.json({
          ok:false,
          message:"failed to created signedUrl"
        }, {status:500})
      }

      signedUrl = updateSignedUrlData.signedUrl
    }

    const newUpdate = (await db.insert(updateTable).values({
      id:nanoid(16),
      title:data.title,
      message:data.content,
      image:signedUrl || "",
      campaignId:id,
    }).returning().execute())[0]

    // log event
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
    const ua = req.headers.get('user-agent') || ''
    await logEvent({
      level: "info",
      category: "update:create",
      user: userId!,
      details: `Update created on campaign ${id}`,
      ipAddress: ip,
      userAgent: ua,
      metaData: { campaignId: id, updateId: newUpdate.id, userId: user.id }
    })

    return NextResponse.json({
      ok:true,
      message:"update created successfully",
      data:newUpdate
    }, { status:201 })

  }catch(err){
    if (process.env.NODE_ENV === "development") console.log(err)
    return NextResponse.json({
      error:"internal server error",
    }, {status:500 })
  }
}


export async function GET(req:NextRequest, {params}:{params:Promise<{id:string}>}){
  try{
    const id = (await params).id
const allUpdates = await db.select().from(updateTable).where(and(eq(updateTable.campaignId, id), eq(updateTable.isDeleted, false)))

    if(allUpdates.length === 0 ){
      return NextResponse.json({
        message:"not updates at yet",
        data:[]
      }, { status:200 })
    }

    return NextResponse.json({
      ok:true,
      message:"all updates",
      data:allUpdates
    }, {status:200})
    
  }catch(err){
    if (process.env.NODE_ENV === "development") console.log(err)
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}

