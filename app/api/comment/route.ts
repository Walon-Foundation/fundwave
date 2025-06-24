import Comment from "@/core/models/commentModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";

export async function GET(){
    try{
        //database connection
        await ConnectDB()
        
        const comments = await Comment.find({})
        if(comments.length === 0 ){
            return apiResponse("not comment at yet", 200, null)
        }
        return apiResponse("all comments", 200, comments)
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}