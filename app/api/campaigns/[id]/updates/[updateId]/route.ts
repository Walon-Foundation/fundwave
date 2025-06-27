import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { db } from "../../../../../../db/drizzle";
import { campiagnTable, updateTable } from "../../../../../../db/schema";
import { and, eq } from "drizzle-orm";


export async function Delete(req:NextRequest, {params}:{params:Promise<{updateId:string}>}){
    try{
        const token = (await cookies()).get("accessToken")?.value
        if(!token){
            return NextResponse.json({
            error:"user is not authenticated",
            }, { status:500 })
        }

        const user = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id:string }
        const checking = (await db.select().from(campiagnTable).where(eq(campiagnTable.id,updateTable.campaignId ))).join(updateTable.campaignId,campiagnTable.id)
    
        const updateId  = (await params).updateId


        await db.delete(updateTable).where(eq(updateTable.id, updateId))

        return NextResponse.json({
            message:"update deleted successfully",
        }, { status:204 })
    }catch(err){
        process.env.NODE_ENV === "development" ? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}