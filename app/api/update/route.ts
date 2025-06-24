import Update from "@/core/models/updateModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";

export async function GET(){
    try{
        //database connection
        await ConnectDB()
        
        const updates = await Update.find({})
        if(updates.length === 0 ){
            return apiResponse("not update at yet", 200, null)
        }
        return apiResponse("all updates", 200, updates)
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}