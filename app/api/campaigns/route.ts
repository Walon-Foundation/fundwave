import { NextResponse, NextRequest } from "next/server";


export async function POST(req:NextRequest){
    try{
        const body = await req.formData()
        console.log(body)

        return NextResponse.json({
            message:"campaign created",
        }, { status:201 })
    }catch(err){
        process.env.NODE_ENV === "development" ? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}