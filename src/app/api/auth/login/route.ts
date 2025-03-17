import { NextRequest } from "next/server";
import User from "@/libs/models/userModel";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken"
import { loginSchema } from "@/libs/zod/user.schema";
import { errorHandler } from "@/libs/helpers/errorHandler";
import { apiResponse } from "@/libs/helpers/apiResponse";
import { ConnectDB } from "@/libs/configs/mongoDB";


ConnectDB()

export async function POST(req:NextRequest){
    try{
        const reqBody  = await req.json()
        const result = loginSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400,result.error.issues[0].message,null)
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
        const accessToken = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY!,{expiresIn:"1d"})
        const userToken = jwt.sign({
            id:user._id,
            username:user.username, 
            firstName:user.firstName,
            lastName:user.lastname,
            email:user.email,
        },process.env.USER_TOKEN_SECRET_KEY!,{expiresIn:"1d"})

        return apiResponse("Login successful",200,{accessToken,userToken});
    }catch(error){
        return errorHandler(500,"Internal server error",error)
    }
}