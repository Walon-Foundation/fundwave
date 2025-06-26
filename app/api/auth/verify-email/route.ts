import { NextResponse,NextRequest } from "next/server";
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

    await Promise.all([
      await db.update(userTable).set({ isVerified:true}).where(eq(userTable.email, result[0].userEmail)),
      await db.delete(emailVerifcationTable).where(eq(emailVerifcationTable.token, token))
    ])

    return NextResponse.redirect(process.env.NODE_ENV === "development"?"http://localhost:3000/login": "https//fundwavesl.vercel.app")

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err) : ""
    return NextResponse.json({
      error:"internal server error",
    },{ status:500 })
  }
}