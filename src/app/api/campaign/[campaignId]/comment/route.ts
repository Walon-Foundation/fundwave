import { NextRequest } from "next/server";
import Comment from "@/core/models/commentModel";
import Campaign from "@/core/models/campaignModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { addCommentSchema } from "@/core/validators/comment.schema";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

import { ConnectDB } from "@/core/configs/mongoDB";

export async function POST(req:NextRequest,{params}:{params:Promise<{campaignId:string}>}){
    try{
        //connect to the database
        await ConnectDB();

        //getting the accessToken from the cookies
        const token =  (await cookies()).get("accessToken")?.value as string | undefined
        if(!token){
            return errorHandler(401, "unauthorized", null)
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string};
        const userId = decodedToken;
    
        //getting the params and  data from the request
        const  campaignId = (await params).campaignId

        const reqBody = await req.json()
        const result = addCommentSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid description",result.error)
        }
        const { description } = result.data 


        //finding a campaign with the given ID
        const campaign = await Campaign.findById({_id:campaignId})
        if(!campaign){
            return errorHandler(400, "invalid campaign id", "error in finding the campaign")
        }

        //creating the comments
        const newComment = await new Comment({
            campaignId,
            description,
            userId:userId.id,
            username: userId.username
        })

        campaign.comments.push(newComment._id)
        await campaign.save()

        await newComment.save()

        return apiResponse("comment created", 201, newComment);

    }catch(error){
        return errorHandler(500, "server error", error)
    }
}

export async function GET(req:NextRequest,{params}:{params:{campaignId:string}}){
    try {
        // connect to database
        await ConnectDB();

        //get params from the url
        const { campaignId } = params
        
        //get the comments
        const comments = await Comment.find({campaignId})
        if(comments.length === 0){
            return apiResponse("no comment yet",200, null)
        };

        //sending response to the user
        return apiResponse("all comment for this  campaign", 200, comments)

    }catch(error){
        return errorHandler(500, "server error",error)
    }
};