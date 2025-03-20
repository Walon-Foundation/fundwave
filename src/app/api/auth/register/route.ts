import User from "@/core/models/userModel";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/core/validators/user.schema";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";



export async function POST(req: NextRequest) {
    try{
        //database connection
        await ConnectDB()

        const reqBody = await req.json()
        const result = registerSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400,result.error.issues[0].message,result.error)
        }
        const { firstName, lastName, username, email, password,roles } = result.data
        const user = await User.findOne({email})
        if(user){
            return errorHandler(400,"User already exists",null)
        }
        const passwordHash = await bcrypt.hash(password,10)
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password:passwordHash,
            roles
        })

        await newUser.save()
        return apiResponse("User created successfully",200, undefined)
    }catch(error){
        return errorHandler(500,"Internal server error",error)
    }
}