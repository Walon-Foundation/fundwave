import { NextRequest, NextResponse } from "next/server";
import User from "@/core/models/userModel";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/core/validators/user.schema";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { ConnectDB } from "@/core/configs/mongoDB";
import { generateAccessToken, generateSessionToken, generateUserToken } from "@/core/helpers/jwtHelpers";



export async function POST(req:NextRequest): Promise<NextResponse>{
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
            return errorHandler(401,"User not found","no user found")
        }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return errorHandler(401,"Invalid password","invalid password")
        }

        const sessionToken = generateSessionToken(user._id)
        const userToken = generateUserToken(user)

        const accessToken = generateAccessToken(user)
        let isAdmin;

        if(user.roles === "Admin"){
            isAdmin = true;
        }

        const response = apiResponse("Login successful",200,{userToken, sessionToken,isAdmin});

        response.cookies.set("accessToken",accessToken, {
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 24 * 60 * 60
        })
        return response
    }catch(error){
        return errorHandler(500,"Internal server error",error)
    }
}