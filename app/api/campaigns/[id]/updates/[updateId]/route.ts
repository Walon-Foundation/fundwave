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
    
        const updateId  = (await params).updateId
        
        const [update] = await db.select().from(updateTable).where(eq(updateTable.id, updateId)).limit(1)
        if(!update){
            return NextResponse.json({
                error:"update doesn't exist",
            }, { status:404 })
        }

        const [campaign] = await db.select().from(campiagnTable).where(eq(campiagnTable.id, update.campaignId))
        if(!campaign){
            return NextResponse.json({
                error:"campaign not found",
            }, { status:404 })
        }

        if(campaign.creatorId !== user.id){
            return NextResponse.json({
                error:"unauthorized: Not the campaign creator"
            })
        }

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