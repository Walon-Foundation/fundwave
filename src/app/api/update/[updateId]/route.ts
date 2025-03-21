import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { NextRequest } from "next/server";
import { ConnectDB } from "@/core/configs/mongoDB";
import Update from "@/core/models/updateModel";

export async function DELETE(req:NextRequest, {params}:{params:{updateId:string}}){
    try{
        //database connection
        await ConnectDB()

        const { updateId } = params
        const update = await Update.findByIdAndDelete({id:updateId})
        if(!update){
            return errorHandler(404, "invalid update", null)
        }
        return apiResponse("update deleted", 200, null)
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}

export async function PATCH(req:NextRequest, {params}:{params:{updateId:string}}){
    try{
        //database connection
        await ConnectDB()

        //params
        const { updateId } = params
        
        //data from the user
        const reqBody = await req.json()
        const { description, title } = reqBody

        //getting the comment
        const update = await Update.findOne({_id:updateId})
        if(!update){
            return errorHandler(404, "invalid update id", null)
        }

        update.description = description
        update.title = title
        await update.save()

        return apiResponse("update updated", 200, update)
    }catch(error){
        return errorHandler(500, "server error", error)
    }
}