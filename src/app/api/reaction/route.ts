import Comment from "@/core/models/commentModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";

export async function GET(){
    try{
        const comments = await Comment.find({})
        if(comments.length === 0){
            return apiResponse("No comment yet", 200, null)
        }
        
        return apiResponse("All comment", 200, comments)
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}