import { NextRequest } from "next/server";
import User from "@/core/models/userModel";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken"
import { loginSchema } from "@/core/validators/user.schema";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { ConnectDB } from "@/core/configs/mongoDB";




export async function POST(req:NextRequest){
    try{
        //database connection
        await ConnectDB()

        
        const reqBody  = await req.json()
        const result = loginSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400,result.error.issues[0].message,result.error)
        }
        const { username, password } = result.data

        const user = await User.findOne({ username });
        if(!user){
            return errorHandler(401,"User not found",null)
        }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return errorHandler(401,"Invalid password",null)
        }

        const accessToken = jwt.sign({id:user._id,username:user.username,roles:user.roles, iscampaign:user.isCampaign},process.env.ACCESS_TOKEN_SECRET!,{ expiresIn:"1d" })

        const sessionToken = jwt.sign({id:user._id},process.env.SESSION_TOKEN_SECRET!, { expiresIn: "1d"})
        const userToken = jwt.sign({
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

        const response = apiResponse("Login successful",200,{userToken, sessionToken});
        
        response.cookies.set(
            "accessToken",accessToken,{
                httpOnly:true,
                maxAge: 24 * 60 * 60 * 1000,
                path:"/",
                secure: true
            }
        )

        return response
    }catch(error){
        return errorHandler(500,"Internal server error",error)
    }
}