import Campaign from "@/core/models/campaignModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { NextRequest } from "next/server";
import Update from "@/core/models/updateModel";
import { addUpdateSchema } from "@/core/validators/update.schema";
import { ConnectDB } from "@/core/configs/mongoDB";

export async function POST(req:NextRequest, {params}:{params:{campaignId:string}}){
    try{
        //database connection
        await ConnectDB()

        const { campaignId } = params;

        const reqBody = await req.json()
        const result = addUpdateSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid request body",result.error)
        }

        const campaign = await Campaign.findOne({_id:campaignId})
        if(!campaign){
            return errorHandler(400, "campaign not found", "invalid campaignId")
        }

        const {title, description} = result.data

        //adding new update
        const newUpdate = new Update({
            title,
            description,
            campaignId
        })

        campaign.update.push(newUpdate._id)
        await campaign.save()

        await newUpdate.save()

        return apiResponse("update created", 201, newUpdate);
    }catch(error){
        return errorHandler(500, "server error", error)
    }
}