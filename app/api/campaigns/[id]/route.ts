import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/drizzle";
import { campiagnTable, userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken"
import { deletedCampaignEmail } from "../../../../lib/nodeMailer";

export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>} ){
  try{
    //auth from cookie
    const token = (await cookies()).get("accessToken")?.value
    if(!token){
      return NextResponse.json({
        error:"user not authenticated",
      }, {status:401})
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id:string, role:string }
    if(!user || user.role != "admin"){
      return NextResponse.json({
        error:"invalid user auth token"
      }, { status: 401 })
    }

    const id  = (await params).id

    const userExist = await db.select().from(userTable).where(eq(userTable.id, user.id)).limit(1)
    if(!userExist){
      return NextResponse.json({
        error:"user not found, invalid user id",
      }, {status:400})
    }

    await Promise.all([
      await deletedCampaignEmail(userExist[0].email, userExist[0].name),
      await db.delete(campiagnTable).where(eq(campiagnTable.id, id))
    ])

    return NextResponse.json({
      message:"Campaign deleted successfully",
    }, { status: 204 })

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}