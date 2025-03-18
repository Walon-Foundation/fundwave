import User from "@/core/models/userModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server";
import { ConnectDB } from "@/core/configs/mongoDB";

export async function GET(req:NextRequest){
    try{
        //database connection
        await ConnectDB()

        //geting the roles from the header
        const authHeader = req.headers.get("authorization")
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return errorHandler(404, "invalid token", "error with the token")
        }
        const token  = authHeader.split("")[1]
        const decodeUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!,) as {roles:string}
        if(decodeUser.roles === "Admin"){
            return errorHandler(401, "unauthorized", "not an admin")
        }
        const user = await User.find({})
        if(user.length === 0){
            return apiResponse("Not users yets", 200, null)
        }
        return apiResponse("All users", 200, user)
    }catch(error){
        return errorHandler(500, "server error", error)
    }
}