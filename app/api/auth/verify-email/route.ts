import { NextResponse,NextRequest } from "next/server";
import { config } from "../../../../config/config";
import { db } from "../../../../db/drizzle";
import { emailVerifcationTable, userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";


export async function GET(req:NextRequest){
  try{
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if(!token){
      return NextResponse.json({
        error:"token not found",
      }, { status:400 })
    }

    const result = await db.select().from(emailVerifcationTable).where(eq(emailVerifcationTable.token, token)).limit(1)
    if(result.length <=0){
      return NextResponse.json({
        error:"invalid token",
      }, { status:401 })
    }

    await db.update(userTable).set({ isVerified:true}).where(eq(userTable.email, result[0].userEmail))
    await db.delete(emailVerifcationTable).where(eq(emailVerifcationTable.token, token))

    return NextResponse.redirect("http://localhost:3000/login")

  }catch(err){
    config.NODE_ENV === "dev" ? console.log(err) : ""
    return NextResponse.json({
      error:"internal server error",
    },{ status:500 })
  }
}