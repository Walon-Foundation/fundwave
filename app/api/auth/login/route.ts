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

    const accessToken = jwt.sign({id:user[0].id, name:user[0].name, role:user[0].role}, process.env.JWT_SECRET!, {
      expiresIn:'1d',
    })

    return NextResponse.json({
      message:"user login",
      data:{
        user:user[0],
        token:accessToken
      }  
    }, { status:200 })

  }catch(err){
    
    process.env.NODE_ENV === "development"? console.log(err):""
    return NextResponse.json({
      error:"Internal server error",
    }, { status: 500 })
  }
}