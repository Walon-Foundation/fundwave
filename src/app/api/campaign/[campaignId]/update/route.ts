import Campaign from "@/core/models/campaignModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { NextRequest } from "next/server";
import Update from "@/core/models/updateModel";
import { addUpdateSchema } from "@/core/validators/update.schema";
import { ConnectDB } from "@/core/configs/mongoDB";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export async function POST(req:NextRequest, {params}:{params:Promise<{campaignId:string}>}){
    try{
        //database connection
        await ConnectDB()

        //getting the accessToken from the cookies
        const token =  (await cookies()).get("accessToken")?.value as string | undefined
        if(!token){
            return errorHandler(401, "unauthorized", null)
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string};
        const decodedUser = decodedToken;

        const campaignId  = (await params).campaignId;

        const reqBody = await req.json()
        const result = addUpdateSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid request body",result.error)
        }

        const campaign = await Campaign.findOne({_id:campaignId})
        if(!campaign){
            return errorHandler(400, "campaign not found", "invalid campaignId")
        }

        if(decodedUser.id != campaign.creatorId){
            return errorHandler(401, "not authorized to add update", "not the campaign creator")
        }

        const {title, description} = result.data

        //adding new update
        const newUpdate = new Update({
            title,
            description,
            campaignId,
            campaignName: campaign.campaignName
        })

        campaign.update.push(newUpdate._id)
        await campaign.save()

        await newUpdate.save()

        return apiResponse("update created", 201, newUpdate);
    }catch(error){
        return errorHandler(500, "server error", error)
    }
}