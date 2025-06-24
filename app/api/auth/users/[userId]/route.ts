import { supabase } from "@/core/configs/supabase";
import User from "@/core/models/userModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { sendUserDeletedAccountEmail } from "@/core/configs/nodemailer";
import Campaign from "@/core/models/campaignModel";
import Comment from "@/core/models/commentModel";
import Update from "@/core/models/updateModel";
import { NextRequest } from "next/server";

export async function DELETE(req:NextRequest, {params}: {params:Promise<{userId:string}>}){
    try{
        //database connection
        await ConnectDB()

        //getting the admin accessToken from the cookies
        const token =  (await cookies()).get("accessToken")?.value as string | undefined
        if(!token){
            return errorHandler(401, "unauthorized", "no token found")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string,roles:string};
        if(decodedToken.roles != "Admin"){
            return errorHandler(401, "unauthorized", "not admin")
        }

        const { userId } = await params
        console.log(userId)

        const user = await User.findByIdAndDelete(userId)
        if(!user){
            return errorHandler(404, "user not found", null)
        }

        //deleting all the campaign created by the user
        const campaign = await Campaign.find({creatorId:user._id})
        if(!campaign){
            return errorHandler(404, "campaigns not found", null)
        }
        
        const campaigns = await Campaign.deleteMany({creatorId:user._id})
        if(!campaigns){
            return errorHandler(404, "campaigns not found", null)
        }

        //deleting comments and update related to the campaign created by the user
        await Comment.deleteMany({campaignId:campaign.map((campaign) => campaign._id)})
        await Update.deleteMany({campaignId: campaign.map((campaign) => campaign._id)})


        //deleting the user profile picture from supabase
        const {error} = await supabase.storage.from("profiles").remove(user.username)
        if(error){
            return errorHandler(500, "server error", error)
        }

        //sending email to tell the user that their account has been deleted
        try{
            await sendUserDeletedAccountEmail(user.email, user.username)
        }catch(error){
            console.error("Failed to send verification email: ",error)
        }

        return apiResponse("user deleted", 200, null)
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}