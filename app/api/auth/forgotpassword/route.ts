import bcrypt from "bcryptjs";
import User from "@/core/models/userModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { ConnectDB } from "@/core/configs/mongoDB";
import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/core/validators/user.schema";

export async function PATCH(req:NextRequest){
    try{
        //database connecction
        await ConnectDB()

        //data from the user
        const reqBody = await req.json()
        const result = forgotPasswordSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid user body",result.error)
        }
        const {username, password} = result.data
        const user = await User.findOne({username})
        if(!user){
            return errorHandler(401, "invalid username", "wrong username")
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if(passwordMatch){
            return errorHandler(401, "please enter a new password", "new password and old are the same")
        }
        const passwordHashed = await bcrypt.hash(password, 10);

        user.password = passwordHashed;

        await user.save();

        return apiResponse("user password update", 200, null);
    }catch(error){
        return errorHandler(500, "server error",error)
    }
}