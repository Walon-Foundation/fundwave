import Comment from "@/core/models/commentModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { NextRequest } from "next/server";
import { ConnectDB } from "@/core/configs/mongoDB";



export async function DELETE({params}: {params:{commentId:string}}){
    try{
        //database connection
        await ConnectDB()

        const { commentId } = params
        const comment = await Comment.findByIdAndDelete({id:commentId})
        if(!comment){
            return errorHandler(404, "invalid comment", null)
        }
        return apiResponse("comment deleted", 200, null)
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}

export async function PATCH(req:NextRequest, {params}:{params:{commentId:string}}){
    try{
        //database connection
        await ConnectDB()

        //params
        const { commentId } = params
        
        //data from the user
        const reqBody = await req.json()
        const { description } = reqBody

        //getting the comment
        const comment = await Comment.findOne({_id:commentId})
        if(!comment){
            return errorHandler(404, "invalid comment id", null)
        }

        comment.description = description
        await comment.save()

        return apiResponse("comment update", 200, comment)
    }catch(error){
        return errorHandler(500, "server error", error)
    }
}