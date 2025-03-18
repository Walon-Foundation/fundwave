import Reaction from "@/core/models/reactionModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";
import { NextRequest } from "next/server";
import Comment from "@/core/models/commentModel";
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest, {params}:{params:{commentId:string}}){
    try{
        //database connection
        await ConnectDB()

        //getting the userId
        const authHeader = req.headers.get("authorization");
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return errorHandler(401,"Unauthorized",null)
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string};
    
        const userId = decodedToken;
        //getting the params
        const { commentId } = params

        //data from the user
        const reqBody = await req.json()
        const {dislike, like} = reqBody

        //getting the comment
        const comment = await Comment.findOne({_id:commentId})
        if(!comment){
            return errorHandler(404, "no comment found","error occured")
        }

        //seeing if the user has already liked if yes we make sure the don't like again
        const reaction = await Reaction.findOne({_id:commentId, userId:userId.id})
        if(reaction){
            return errorHandler(400, "user already reacted","user want to double react")
        }
        const newReaction = new Reaction({
            dislike,
            like,
            userId:userId.id,
            commentId
        })
        await newReaction.save()

        return apiResponse("reaction created", 200, newReaction)
    }catch(error){
        return errorHandler(500, "server error", error)
    }
}