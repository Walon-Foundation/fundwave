import { NextResponse } from "next/server";

export const apiResponse = (message:string, statusCode:number, data: undefined | object) => {
    return NextResponse.json({message,data},{status:statusCode})
}