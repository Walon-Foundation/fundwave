import { NextResponse } from "next/server";

export const errorHandler = ( statusCode:number, message:string, error:Error | null | string | unknown) => {
    if(error){
        console.error(error)
    }
    return NextResponse.json({message},{status:statusCode})
}