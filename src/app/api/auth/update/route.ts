import User from "@/core/models/userModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { apiResponse } from "@/core/helpers/apiResponse";
import { updateUserSchema } from "@/core/validators/user.schema";
import { ConnectDB } from "@/core/configs/mongoDB";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { supabase } from "@/core/configs/supabase";


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

        const formData = await req.formData()
        const gender =  formData.get("gender");
        const address =  formData.get("address");
        const qualification =  formData.get("qualification");    
        const dateOfBirth =  formData.get("dateOfBirth");
        const phoneNumber =  formData.get("phoneNumber");
        const profilePicture = formData.get("profilePicture") as File | null; 

        const reqBody = {
            sex:gender,
            address,
            qualification,
            DOB:dateOfBirth,
            phoneNumber,
        }
        const result = updateUserSchema.safeParse(reqBody)
        if(!result.success){
            return errorHandler(400, "invalid request body",result.error)
        }

        if(!profilePicture){
            return errorHandler(400, "invalid request body","no profile picture found")
        }

        const maxSizeBytes = 400 * 1024
        const fileSize = profilePicture.size
        const buffer = await  profilePicture.arrayBuffer()
        const bytes = Buffer.from(buffer)

        if(fileSize > maxSizeBytes){
            return errorHandler(400, "image file to large","file size too large",)
        }

        const filename = `${profilePicture.name} - ${Date.now()} - ${decodedUser.id}`

        const {error} = await supabase.storage.from("profiles").upload(filename, bytes, {
            cacheControl: '3600',
            upsert: false,
            contentType: profilePicture.type,
            
        })

        if(error){
            return errorHandler(400, "invalid request body",error)
        }

        const {data:urlData} = supabase.storage.from("profiles").getPublicUrl(filename,{
            transform:{
                width:400,
                height:400,
                quality:70
            }
        })
        const profilePictureUrl = urlData.publicUrl

        const user = await User.findOne({_id:decodedUser.id})
        if(!user){
            return errorHandler(401, "invalid user","user not found")
        }

        //update the user
        user.sex = gender;
        user.phoneNumber = phoneNumber;
        user.address = address;
        user.DOB  = dateOfBirth;
        user.qualification = qualification
        user.isCampaign = true;
        user.profilePicture = profilePictureUrl
        

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
            DOB:user.DOB,
            address:user.address,
            roles:user.roles,
            isCampaign:user.isCampaign,
            createdAt:user.createdAt
        },process.env.USER_TOKEN_SECRET!,{ expiresIn:"1d" })

        const accessToken = jwt.sign({id:user._id,username:user.username,roles:user.roles, iscampaign:user.isCampaign},process.env.ACCESS_TOKEN_SECRET!)

        const response = apiResponse("user update",  200, {userToken} );

        response.cookies.set("accessToken",accessToken,{
            httpOnly:true,
            sameSite:"none",
            secure:true, 
            maxAge: 24 * 60 * 60
        })

        return response
    }catch(error){
        return errorHandler(500,"server error",error)
    }
}


