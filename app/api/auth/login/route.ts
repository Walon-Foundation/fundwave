import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../db/drizzle";
import {  eq } from "drizzle-orm";
import { loginSchema } from "../../../../validations/user";
import { userTable } from "../../../../db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest){
  try{
    const body = await req.json()

    const {success, error, data} = loginSchema.safeParse(body)
    
    if(!success){
      return NextResponse.json({
        error:"invalid input data",
      },{ status:500 })
    }

    const user = await db.select().from(userTable).where(eq(userTable.email, data.email)).limit(1)
    if(user.length === 0 || !(await bcrypt.compare(data.password, user[0].password))){
      return NextResponse.json({
        error: "invalid username or password",
      }, { status:404 })
    }

    const sessionToken = jwt.sign({id:user[0].id, name:user[0].name, role:user[0].role}, process.env.JWT_SECRET!, {
      expiresIn:'7d',
    })

    const userToken = jwt.sign({
      name:user[0].name,
      email:user[0].email,
      isVerified:user[0].isVerified,
      phone:user[0].phone,
      address:user[0].address,
      createdAt:user[0].createdAt,
      totalDonated:user[0].amountContributed,
    }, process.env.USER_TOKEN!, {
      expiresIn:"7d"
    })

    const accessToken = jwt.sign({id:user[0].id}, process.env.ACCESS_TOKEN!,{
      expiresIn:"7d"
    })

    const response = NextResponse.json({
      message:"user login",
      data:{
        user:userToken,
        token:sessionToken
      }  
    }, { status:200 })

    response.cookies.set("accessToken", accessToken, {
      httpOnly:true,
      secure:false,
      maxAge: 7 * 24 * 60 * 60,
      sameSite:'lax'
    })

    return response

  }catch(err){
    
    process.env.NODE_ENV === "development"? console.log(err):""
    return NextResponse.json({
      error:"Internal server error",
    }, { status: 500 })
  }
}