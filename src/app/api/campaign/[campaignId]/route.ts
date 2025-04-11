import { NextRequest } from "next/server";
import Campaign from "@/core/models/campaignModel";
import { ConnectDB } from "@/core/configs/mongoDB";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { supabase } from "@/core/configs/supabase";
import User from "@/core/models/userModel";
import { sendDeletedCampaignEmail } from "@/core/configs/nodemailer";
import Comment from "@/core/models/commentModel";
import Update from "@/core/models/updateModel";

export async function GET(req:NextRequest,{params}:{params:Promise<{campaignId:string}>}){
    try{
        //connecting to the database
        await ConnectDB()

        //getting campaignId from the request url
        const campaignId = (await params).campaignId

        //getting the campaign based on the given Id
        const campaign = await Campaign.findOne({_id:campaignId})
        if(!campaign){
            return errorHandler(400, "invalid campaign id", "wrong id")
        };

        //sending the campaign to the user
        return apiResponse(`camapign with id: ${campaignId} `, 200, campaign )

    }catch(error){
        return errorHandler(500, "server error",error)
    }
};



export async function DELETE(req:NextRequest,{params}:{params:Promise<{campaignId:string}>}){
    try{
        //connecting to database
        await ConnectDB()

        //getting the accessToken from the cookies
        const token =  (await cookies()).get("accessToken")?.value as string | undefined
        if(!token){
            return errorHandler(401, "unauthorized", null)
        }

        const decodeUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!,) as {roles:string}
        console.log(decodeUser.roles)
        if(decodeUser.roles != "Admin"){
            return errorHandler(401, "unauthorized", "not an admin")
        }

        //gettiing params from the url
        const campaignId = (await params).campaignId

        //getting and deleting the campaign based on the given Id
        const campaign = await Campaign.findByIdAndDelete({_id:campaignId})
        if(!campaign){
            return errorHandler(401, "invalid camapign id", "wrong id")
        };

        const user = await User.findOne({username:campaign.creatorName})
        if(!user){
            return errorHandler(404, "user not found", "user not found")
        }

        //removing the delete campaign id from the user document
        await user.updateMany({$pull:{campaigns:campaignId}})

        //delete all comment and update related to the campaign
        await Comment.deleteMany({campaignId:campaignId})
        await Update.deleteMany({campaignId:campaignId})

        //removing the campaign picture from supabase
        const {error} = await supabase.storage.from("campaigns").remove(campaign.campaignName)
        if(error){
            return errorHandler(500, "server error", error)
        }

        //sending email to the user
        try{
            await sendDeletedCampaignEmail(user.username, user.email)
        }catch(error){
            return errorHandler(500, "server error", error)
        }

        return apiResponse("campaign deleted", 200,  {campaignId})

    }catch(error){
        return errorHandler(505, "server error", error)
    }
}