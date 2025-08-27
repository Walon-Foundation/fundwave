import { NextResponse } from "next/server";

//Todo: fix this hook so clerk can use it

export async function GET(){
    try{
        return NextResponse.json({
            ok:true,
            message:"user deleted"
        }, { status:200 })
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            ok:false,
            message:"internal server error",
        }, { status:500 })
    }   
}