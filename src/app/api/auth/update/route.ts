import User from "@/core/models/userModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { updateUserSchema } from "@/core/validators/user.schema";
import { ConnectDB } from "@/core/configs/mongoDB";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"

export async function PATCH(req:NextRequest){
    try{
        //connecting to the database
        await ConnectDB()

        //get userId from the accessToken
        
        const authHeader = req.headers.get("authorization");
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return errorHandler(401,"Unauthorized",null)
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string};
    
        const userId = decodedToken;

        const reqBody = await req.json()
        const result = updateUserSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid request body","failed the zod validation")
        }
        const {phoneNumber, sex, country, capitalCity, qualificaton,DOB} = result.data

        const user = await User.findOne({_id:userId.id})
        if(!user){
            return errorHandler(401, "invalid user","user not found")
        }

        //update the user
        user.sex = sex;
        user.phoneNumber = phoneNumber;
        user.country = country;
        user.capitalCity  = capitalCity;
        user.DOB  = DOB;
        user.qualification = qualificaton

        //saving the user
        await user.save()

        return apiResponse("user update",  200, null);

    }catch(error){
        return errorHandler(500,"server error",error)
    }
}