import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../db/drizzle";
import { commentTable, userTable } from "../../../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { sendNotification } from "@/lib/notification";
import { createComment } from "@/validations/comment";
import { logEvent } from "@/lib/logging";


export async function DELETE(req:NextRequest, {params}:{params:Promise<{commentId:string}>}){
    try{
        //authenticating the user
        const { userId } = await auth()
        const userExist = await db.select().from(userTable).where(eq(userTable.clerkId, userId as string)).limit(1)

        if(!userId || userExist.length === 0){
            return NextResponse.json({
                ok:false,
                message:"user is not authenticated"
            }, { status:401 })
        }

        const commentId = (await params).commentId

        //getting the campaignId from the comment before deleting
        const campaignId = (await db.select({ campaignId:commentTable.campaignId}).from(commentTable).where(eq(commentTable.id, commentId)).execute())[0]


//soft-delete and send notification
        await Promise.all([
            db.update(commentTable).set({ isDeleted: true, updatedAt: new Date() }).where(and(eq(commentTable.id, commentId), eq(commentTable.userId, userExist[0].id))).execute(),
            sendNotification("Comment delete", "comment", userExist[0].id, campaignId.campaignId )
        ])

        // log event
        try {
          const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
          const ua = req.headers.get('user-agent') || ''
          await logEvent({
            level: "warning",
            category: "comment:delete",
            user: userId!,
            details: `Deleted own comment ${commentId}`,
            ipAddress: ip,
            userAgent: ua,
            metaData: { commentId, campaignId: campaignId.campaignId }
          })
        } catch {}

        //sending a 204 response
        return NextResponse.json({
            ok:true,
            message:"comment deleted successfully",
        }, { status:200 })
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}


export async function PATCH(req:NextRequest, {params}:{params:Promise<{commentId:string}>}){
    try{
        const { userId:clerkId } = await auth()
        const user = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId!)).limit(1).execute())[0]

        if(!user || !clerkId){
            return NextResponse.json({
                ok:false,
                message:"user is not authenticated",
            }, { status:401 })
        }

        const commentId = (await params).commentId

        const reqBody = await req.json()

        const { success, data, error } = createComment.safeParse(reqBody)

        if(!success){
        if (process.env.NODE_ENV === "development") console.log(error)
            return NextResponse.json({
                ok:false,
                message:"invalid request body",
            }, { status:400 })
        }

        const updateComment = (await db.update(commentTable).set({ message:data.comment, updatedAt:new Date()}).where(eq(commentTable.id, commentId)).returning().execute())[0]

        await sendNotification("Comment updated", "comment", user.id, updateComment.campaignId)

        // log event
        try {
          const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
          const ua = req.headers.get('user-agent') || ''
          await logEvent({
            level: "info",
            category: "comment:update",
            user: clerkId!,
            details: `Updated comment ${commentId}`,
            ipAddress: ip,
            userAgent: ua,
            metaData: { commentId, campaignId: updateComment.campaignId }
          })
        } catch {}

        return NextResponse.json({
            ok:true,
            message:"updated comment",
            data:updateComment
        }, { status:200 })
        
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            ok:false,
            message:"internal server error",
        }, { status:500 })
    }
}