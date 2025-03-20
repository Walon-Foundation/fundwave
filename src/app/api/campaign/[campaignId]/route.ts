import { NextRequest } from "next/server";
import Campaign from "@/core/models/campaignModel";
import { ConnectDB } from "@/core/configs/mongoDB";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import jwt from "jsonwebtoken"

export async function GET(req:NextRequest,{params}:{params:{campaignId:string}}){
    try{
        //connecting to the database
        await ConnectDB()

        //getting campaignId from the request url
        const { campaignId } = params

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



export async function DELETE(req:NextRequest,{params}:{params:{campaignId:string}}){
    try{
        //connecting to database
        await ConnectDB()

        //geting the roles from the header
        const authHeader = req.headers.get("authorization")
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return errorHandler(404, "invalid token", "error with the token")
        }

        const token  = authHeader.split(" ")[1]
        const decodeUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!,) as {roles:string}
        if(decodeUser.roles === "Admin"){
            return errorHandler(401, "unauthorized", "not an admin")
        }

        //gettiing params from the url
        const { campaignId} = params

        //getting and deleting the campaign based on the given Id
        const campaign = await Campaign.findByIdAndUpdate({_id:campaignId})
        if(!campaign){
            return errorHandler(401, "invalid camapign id", "wrong id")
        };

        return apiResponse("campaign deleted", 200,  {campaignId})

    }catch(error){
        return errorHandler(505, "server error", error)
    }
}