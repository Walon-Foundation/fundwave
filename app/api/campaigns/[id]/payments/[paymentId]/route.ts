import { NextResponse, NextRequest } from "next/server";


export async function DELETE(req:NextRequest,{params}:{params:Promise<{paymentId:string}>}){
    try{
        return NextResponse.json({
            ok:false,
            message:"payment deleted successfully",
        }, { status:204 })
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error:"internal server error",
        }, {status:500})
    }
}