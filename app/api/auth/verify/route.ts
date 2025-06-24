import { ConnectDB } from "@/core/configs/mongoDB";
import User from "@/core/models/userModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { verifyVerificationToken } from "@/core/helpers/jwtHelpers";

export async function GET(req: NextRequest){
    try{
        await ConnectDB();

        const {searchParams} = new URL(req.url)
        const token = searchParams.get("token")

        if(!token){
            return errorHandler(400, "Token not found", null);
        }

        const decodedToken = verifyVerificationToken(token) as { id :string};
        const user = await User.findById(decodedToken.id);

        if(!user){
            return errorHandler(400, "User not found", null);
        }

        if(user.isVerified){
            const url = process.env.NODE_ENV === "development" ? 
            "http://localhost:3000/login" 
            : 
            "https://fundwavesl.vercel.app/login";
            
            return NextResponse.redirect(url);
        }

        user.isVerified = true;

        await user.save();

        let url;

        if(process.env.NODE_ENV === "development"){
            url = "http://localhost:3000/verification";
        }else{
            url = "https://fundwavesl.vercel.app/verification";
        }

        return NextResponse.redirect(url);
    }catch(error){
        return errorHandler(500, "Internal server error", error);
    }
}   