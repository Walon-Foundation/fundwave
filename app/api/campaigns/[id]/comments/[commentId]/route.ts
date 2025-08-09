import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { db } from "../../../../../../db/drizzle";
import { commentTable, userTable } from "../../../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";


export async function Delete(req:NextRequest, {params}:{params:Promise<{commentId:string}>}){
    try{
        const { userId } = await auth()
        const userExist = await db.select().from(userTable).where(eq(userTable.clerkId, userId as string)).limit(1)

        const commentId = (await params).commentId

        await db.delete(commentTable).where(and(eq(commentTable.id, commentId), eq(commentTable.userId, userExist[0].id)))

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