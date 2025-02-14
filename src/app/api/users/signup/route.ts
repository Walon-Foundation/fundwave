import { NextResponse,NextRequest } from "next/server";
import User from "@/libs/models/userModel";
import { ConnectDB } from "@/libs/configs/mongoDB";
import bcrypt from "bcryptjs";


export async function POST(req:NextRequest){
    try{
        //connecting to the database
        await ConnectDB()

        //getting the user data from the request body
        const reqBody = await req.json();
        const { email,password,firstName,lastName,country,capitalCity,phoneNumber,} = reqBody;

        //validating the data
        if(!email || !password || !firstName || !lastName || !capitalCity || !phoneNumber || !country){
            return NextResponse.json(
                {message:"All fields required"},
                {status:404}
            )
        }

        //checking if the user exist
        const user = await User.findOne({email})
        if(user){
            return NextResponse.json(
                {message:"Invalid email field"},
                {status:409}
            )
        }

        //checking and comparing password the password
        const passwordHashed = await bcrypt.hash(password, 10)
       
        const newUser = new User({
            email,
            password:passwordHashed,
            firstName,
            lastName,
            country,
            capitalCity,
            phoneNumber,
        })

        await newUser.save()


        //making the userResponse
        const userResponse = newUser.toObject()
        delete userResponse.password

        const response = NextResponse.json(
            {message:"Login sucessfull",userResponse},
            {status:200}
        )


        return response;

    }catch(error:unknown){
        return NextResponse.json(
            {message:'Internal Server Error',error},
            {status:500}
        )
    }
}