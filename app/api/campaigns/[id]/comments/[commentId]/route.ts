import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { db } from "../../../../../../db/drizzle";
import { commentTable } from "../../../../../../db/schema";
import { and, eq } from "drizzle-orm";


export async function Delete(req:NextRequest, {params}:{params:Promise<{commentId:string}>}){
    try{
        const token = (await cookies()).get("accessToken")?.value
        if(!token){
            return NextResponse.json({
                error:"user not authenticated",
            }, { status:401 })
        }
        const user = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id:string } 
        if(!user){
            return NextResponse.json({
                error:"invalid user auth token",
            }, { status:401 })
        }

        const commentId = (await params).commentId

        await db.delete(commentTable).where(and(eq(commentTable.id, commentId), eq(commentTable.userId, user.id)))

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