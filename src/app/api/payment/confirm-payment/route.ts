import { NextRequest } from "next/server";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { cookies } from "next/headers";
import jwt  from "jsonwebtoken"
import { ConfirmPayment } from "@/core/types/monimeType";


export async function POST(req:NextRequest){
    try{

        const token = (await cookies()).get("accessToken")?.value as string
        if(!token){
            return errorHandler(401, "unauthorized", "no access token found")
        }

        //verifing the cookie and get the values stored in it
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string, iscampaign:boolean};
        const decodedUser = decodedToken;

        const data = await req.json()
        if(!data){
            return errorHandler(400, "invalid webhook data", null)
        }

        const paymentData = data as ConfirmPayment

        if(paymentData.status === "completed"){
            console.log(`Payment for the user ${decodedUser.username} is compelete`)
        }

        return apiResponse("completed", 200, null)
    }catch(err){
        return errorHandler(500, "internal server error", err)
    }
}