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
        const token =  (await cookies()).get("accessToken")?.value as string | undefined
        if(!token){
            return errorHandler(401, "unauthorized", "no token found")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string};
    
        const decodedUser = decodedToken;

        const reqBody = await req.json()
        const result = updateUserSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid request body",result.error)
        }
        const {phoneNumber, sex, address, qualificaton,DOB} = result.data

        const user = await User.findOne({_id:decodedUser.id})
        if(!user){
            return errorHandler(401, "invalid user","user not found")
        }

        //update the user
        user.sex = sex;
        user.phoneNumber = phoneNumber;
        user.address = address;
        user.DOB  = DOB;
        user.qualification = qualificaton
        user.isCampaign = true;

        //saving the user
        await user.save()

        //returning the user
        const userToken = jwt.sign({
            profilePicture:user.profilePicture,
            id:user._id,
            username:user.username, 
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            phoneNumber: user.phoneNumber,
            qualification:user.qualification,
            DOE:user.DOB,
            address:user.address,
            roles:user.roles,
            isCampaign:user.isCampaign,
            createdAt:user.createdAt
        },process.env.USER_TOKEN_SECRET!,{ expiresIn:"1d" })

        return apiResponse("user update",  200, {userToken} );

    }catch(error){
        return errorHandler(500,"server error",error)
    }
}