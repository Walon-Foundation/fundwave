import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { db } from "../../../../db/drizzle";
import { userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";


export async function GET(req:NextRequest){
    try{
        //auth
        const token = (await cookies()).get("accessToken")?.value
        if(!token){
            return NextResponse.json({
                error:"user not authenticated",
            }, { status:401 })
        }

        const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id: string}
        if(!decodedUser){
            return NextResponse.json({
                error:"invalid auth token",
            }, { status:401})
        }

        //getting the user
        const user = await db.select().from(userTable).where(eq(userTable.id, decodedUser.id)).limit(1)

        if(user.length === 0 ){
            return NextResponse.json({
                error:"invalid auth token",
            }, { status:401 })
        }

        return NextResponse.json({
            message:"user object",
            data:{
                name:user[0].name,
                email:user[0].email,
                address:user[0].address,
                isVerfied:user[0].isVerified,
                createdAt:user[0].createdAt,
                amount:user[0].amountContributed,
                phone:user[0].phone,
                profile:user[0].profilePicture,
            }
        }, { status:200 })
    }catch(err){
        process.env.NODE_ENV === "development" ? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        }, {status:500})
    }
}