import User from "@/core/models/userModel";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import jwt from "jsonwebtoken"
import { ConnectDB } from "@/core/configs/mongoDB";
import { cookies } from "next/headers";

export async function GET(){
    try{
        //database connection
        await ConnectDB()

        const token =  (await cookies()).get("accessToken")?.value as string | undefined
        if(!token){
            return errorHandler(401, "unauthorized", null)
        }
        
        //verifing the cookie
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string, roles:string};
    
        const decodedUser = decodedToken;
    
        if(decodedUser.roles != "Admin"){
            return errorHandler(401, "Unauthorized", "not eligible to get all users")
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