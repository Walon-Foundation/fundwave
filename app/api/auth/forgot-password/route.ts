import { NextRequest, NextResponse } from "next/server";
import { forgotPassword } from "../../../../validations/user";
import { ForgotPasswordEmail } from "../../../../lib/nodeMailer";


export async function POST(req:NextRequest){
  try{
    const body = await req.json()
    
    const { error, success, data } = forgotPassword.safeParse(body)
    if(!success){
      process.env.NODE_ENV === "development" ? console.log(error.message):""
      return NextResponse.json({
        error:"invalid input",
      }, { status:400 })
    }

    const link = process.env.NODE_ENV === "development" ? `http://localhost:3000/forgot-password/reset-password?email=${data.email}` : `https://fundwavesl.vercel.app/forgot-password/reset-password?email=${data.email}`
    await ForgotPasswordEmail(data.email, link)

    return NextResponse.json({
      message:"forgot password link sent"
    }, { status: 200 })

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      error:"internal server error"
    }, { status:500 })
  }
}