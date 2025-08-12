import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { db } from "../../../../../../db/drizzle";
import { commentTable, userTable } from "../../../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { sendNotification } from "@/lib/notification";


export async function Delete(req:NextRequest, {params}:{params:Promise<{commentId:string}>}){
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


        //deleting and sending notification
        await Promise.all([
            db.delete(commentTable).where(and(eq(commentTable.id, commentId), eq(commentTable.userId, userExist[0].id))).execute(),
            sendNotification("Comment delete", "comment", userExist[0].id, campaignId.campaignId )
        ])

        //sending a 204 response
        return NextResponse.json({
            message:"comment deleted successfully",
        }, { status:204 })
    }catch(err){
        process.env.NODE_ENV === "development" ? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}