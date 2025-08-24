import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../db/drizzle";
import { campaignTable, updateTable, userTable } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { sendNotification } from "@/lib/notification";
import { createUpdate } from "@/validations/update";


export async function DELETE(req:NextRequest, {params}:{params:Promise<{updateId:string}>}){
    try{
        const { userId } = await auth()
        const user = (await db.select().from(userTable).where(eq(userTable.clerkId, userId as string)).limit(1))[0]

        if(!userId || !user){
            return NextResponse.json({
                ok:false,
                message:"user is not authenticated",
            }, { status:401 })
        }
    
        const updateId  = (await params).updateId
        
        const [update] = await db.select().from(updateTable).where(eq(updateTable.id, updateId)).limit(1)
        if(!update){
            return NextResponse.json({
                error:"update doesn't exist",
            }, { status:404 })
        }

        const [campaign] = await db.select().from(campaignTable).where(eq(campaignTable.id, update.campaignId))
        if(!campaign){
            return NextResponse.json({
                error:"campaign not found",
            }, { status:404 })
        }

        if(campaign.creatorId !== user.id){
            return NextResponse.json({
                error:"unauthorized: Not the campaign creator"
            }, { status:401 })
        }

        await db.delete(updateTable).where(eq(updateTable.id, updateId))

        return NextResponse.json({
            ok:true,
            message:"update deleted successfully",
        }, { status:200 })
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}



export async function PATCH(req:NextRequest, {params}:{params:Promise<{updateId:string}>}){
    try{
        const { userId:clerkId } = await auth()
        const user = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId!)).limit(1).execute())[0]

        if(!user || !clerkId){
            return NextResponse.json({
                ok:false,
                message:"user is not authenticated",
            }, { status:401 })
        }

        const updateId = (await params).updateId

        const reqBody = await req.formData()

        const title = reqBody.get("title")
        const content = reqBody.get("content")

        const { success, data, error } = createUpdate.safeParse({
            title,
            content
        })

        if(!success){
        if (process.env.NODE_ENV === "development") console.log(error.message)
            return NextResponse.json({
                ok:false,
                message:"invalid request body",
            }, { status:400 })
        }

        const updateUpdate = (await db.update(updateTable).set({ title:data.title, message:data.content, updatedAt:new Date()}).where(eq(updateTable.id, updateId)).returning().execute())[0]

        await sendNotification("update updated", "update", user.id, updateUpdate.campaignId)

        return NextResponse.json({
            ok:true,
            message:"updated update",
            data:updateUpdate
        }, { status:200 })
        
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            ok:false,
            message:"internal server error",
        }, { status:500 })
    }
}