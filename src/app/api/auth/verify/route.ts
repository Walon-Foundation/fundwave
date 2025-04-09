import { ConnectDB } from "@/core/configs/mongoDB";
import User from "@/core/models/userModel";
import { errorHandler } from "@/core/helpers/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/core/helpers/jwtHelpers";

export async function GET(req: NextRequest){
    try{
        await ConnectDB();

        const {searchParams} = new URL(req.url)
        const token = searchParams.get("token")

        if(!token){
            return errorHandler(400, "Token not found", null);
        }

        const decodedToken = verifySessionToken(token) as { id :string};
        const user = await User.findById(decodedToken.id);

        if(!user){
            return errorHandler(400, "User not found", null);
        }

        user.isVerified = true;

        await user.save();

        return NextResponse.redirect(("http://localhost:3000/verification"));
    }catch(error){
        return errorHandler(500, "Internal server error", error);
    }
}   