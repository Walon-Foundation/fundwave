import User from "@/core/models/userModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { updateUserSchema } from "@/core/validators/user.schema";
import { ConnectDB } from "@/core/configs/mongoDB";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export async function PATCH(req:NextRequest){
    try{
        //connecting to the database
        await ConnectDB()

        //getting the accessToken from the cookies
        const token =  (await cookies()).get("accessToken") as string | undefined
        if(!token){
            return errorHandler(401, "unauthorized", null)
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string};
    
        const decodedUser = decodedToken;

        const reqBody = await req.json()
        const result = updateUserSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid request body","failed the zod validation")
        }
        const {phoneNumber, sex, country, capitalCity, qualificaton,DOB} = result.data

        const user = await User.findOne({_id:decodedUser.id})
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
        user.isCampaign = true;

        //saving the user
        await user.save()

        return apiResponse("user update",  200, null);

    }catch(error){
        return errorHandler(500,"server error",error)
    }
}