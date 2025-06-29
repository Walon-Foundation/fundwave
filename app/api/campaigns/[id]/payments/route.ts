import { NextResponse, NextRequest } from "next/server";

export async function POST(req:NextRequest, {params}:{params:Promise<{id:string}>}){
    try{
        
    }catch(err){
        process.env.NODE_ENV === "development"? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}