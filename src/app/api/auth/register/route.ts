import User from "@/core/models/userModel";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/core/validators/user.schema";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { ConnectDB } from "@/core/configs/mongoDB";
import path from "path";
import fs from "fs"

const uploadDir = path.join(process.cwd(), "public", "uploads")

export async function POST(req: NextRequest) {
    try{
        //database connection
        await ConnectDB()

        const formData = await req.formData()
        const profilePicture = formData.get("profilePicture") as File
        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const firstName = formData.get("firstName") as string
        const lastName = formData.get("lastName") as string

        const reqBody = {
            firstName,
            lastName,
            username,
            email,
            password,
        }
        const result = registerSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400,result.error.issues[0].message,result.error)
        }

        if(!profilePicture){
            return errorHandler(400,"Profile picture is required",null)
        }

        const fileName = profilePicture.name
        const localfilePath = path.join(uploadDir, fileName)

        const user = await User.findOne({email})
        if(user){
            return errorHandler(400,"User already exists",null)
        }
        const passwordHash = await bcrypt.hash(password,10)

        const buffer = await profilePicture.arrayBuffer()
        const binaryData = Buffer.from(buffer)
        fs.writeFileSync(localfilePath,binaryData)

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password:passwordHash,
            profilePicture:localfilePath
        })

        await newUser.save()
        return apiResponse("User created successfully",201, undefined)
    }catch(error){
        return errorHandler(500,"Internal server error",error)
    }
}