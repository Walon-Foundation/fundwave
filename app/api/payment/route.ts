import { NextRequest } from "next/server";
import createPaymentCode from "@/core/helpers/generateCode";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { cookies } from "next/headers";
import jwt  from "jsonwebtoken"


export async function POST(req:NextRequest){
    try{
        const token = (await cookies()).get("accessToken")?.value as string
        if(!token){
            return errorHandler(401, "unauthorized", "no access token found")
        }

        //verifing the cookie and get the values stored in it
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string, iscampaign:boolean};
        const decodedUser = decodedToken;

        const body = await req.json()

        const { phoneNumber, amount, campaignName } = body

        //validate later with zod

        const data = await createPaymentCode(campaignName, decodedUser.username, amount,phoneNumber, decodedUser.id)

        //stored payment in the database

        const code = data?.result.ussdCode

        return apiResponse("payment code generate", 201, {
            ussdCode:code
        })

    }catch(err){
        return errorHandler(500, "internal status error", err)
    }
}



