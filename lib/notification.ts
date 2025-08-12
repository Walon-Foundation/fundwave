import { db } from "@/db/drizzle"
import { notificationTable } from "@/db/schema"
import { nanoid } from "nanoid"

type TypeEnum = "comment" | "donations" | "update" | "campaignStuff"


export async function sendNotification(title:string, type:TypeEnum, userId:string , campaignId:string){
    try{
        //making sure the values are not null
        if(title.trim() === "" || type.trim() === "" || userId.trim() === "" || campaignId.trim() === ""){
            return new Error("title, type, userId and campaignId should not be empty")
        }

        //inserting the notification into the database
        await db.insert(notificationTable).values({
            id:nanoid(16),
            title,
            type,
            campaignId,
            userId: userId || undefined,
        }).execute()

        console.log("Notification created and added")
    }catch(err){
        process.env.NODE_ENV === "development" ? console.log(err):""
    }
}