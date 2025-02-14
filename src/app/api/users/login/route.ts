import { NextResponse,NextRequest } from "next/server";
import User from "@/libs/models/userModel";
import { ConnectDB } from "@/libs/configs/mongoDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest){
    try{
        //connecting to the database
        await ConnectDB()

        //getting the user data from the request body
        const reqBody = await req.json();
        const { email,password } = reqBody;

        //validating the data
        if(!email || !password){
            return NextResponse.json(
                {message:"All fields required"},
                {status:404}
            )
        }

        //checking if the user exist
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json(
                {message:"Invalid email field"},
                {status:401}
            )
        }

        //checking and comparing password the password
        const passwordMatched = await bcrypt.compare(password, user.password)
        if(!passwordMatched){
            return NextResponse.json(
                {message:"Invalid Password"},
                {status:401}
            )
        }

        //making the access token
        const accessToken = jwt.sign({id:user._id.toString()},process.env.ACCESS_TOKEN_SECRET!,{
            expiresIn:"1d"
        })

        //making the userResponse
        const userResponse = user.toObject()
        delete userResponse.password

        const response = NextResponse.json(
            {message:"Login sucessfull",userResponse},
            {status:200}
        )

        //sending cookie to the user
        response.cookies.set("user",accessToken)

        return response;

    }catch(error:unknown){
        return NextResponse.json(
            {message:'Internal Server Error',error},
            {status:500}
        )
    }
}