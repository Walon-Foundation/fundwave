import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/nodeMailer";


export async function POST(req:NextRequest){
    try{
        const Webhhook = process.env.WEBHOOK_SECRET
        if(!Webhhook){
            throw new Error("Missing Clerk webhook secret")
        }

        // Get headers from Clerk's request
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        if(!svix_id || !svix_signature || svix_timestamp ){
            return NextResponse.json({ok:false, messag:"Invalid headers"}, { status:400 })
        }

        const payload = await req.text()

        const wh = new Webhook(Webhhook)
        let evt:any

        try{
            evt = wh.verify(payload,{
                "svix-id":svix_id,
                "svix-signature":svix_signature,
                "svix-timestamp":svix_timestamp as string,
            })
        }catch(err){
            console.log(err)
            return NextResponse.json({ok:false, message:"invalid signature"}, { status:400 })
        }

        const {type, data} = evt

        if(type === "user.created"){
            await db.insert(userTable).values({
                id:nanoid(16),
                clerkId: data.id,
                name: `${data.first_name} ${data.Last_name}`,
                email: data.email_addresses.email_address,
                profilePicture:data.profile_image_url
            }).execute()

            //seeing the confirm success message in the console if in development mode
            process.env.NODE_ENV === "development" ? console.log("user added to the database from the hook") : ""
        }

        //sending the welcome email
        await sendEmail("welcome", data.email_addresses.email_address, "Welcome to Fundwave", { name: data.first_name})

        return NextResponse.json({ok:true, message:"hook recieved"}, { status:200 })
    }catch(err){
        return NextResponse.json({
            ok:false,
            message:"Webhhook failed",
        }, { status: 500 })
    }
}