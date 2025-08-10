import { NextResponse } from "next/server"


export async function GET(){
    try{
        //Todo: add all the need data for user dashboard
    }catch(err){
        process.env.NODE_ENV === 'development' ? console.log(err) : ""
        return NextResponse.json({
            ok:false,
            message:"internal server error",
        }, { status:500 })
    }
}