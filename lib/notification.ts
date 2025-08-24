import { db } from "@/db/drizzle"
import { notificationTable } from "@/db/schema"
import { nanoid } from "nanoid"

type TypeEnum = "comment" | "donations" | "update" | "campaignStuff"

export async function sendNotification(title: string, type: TypeEnum, userId: string, campaignId: string) {
    try {
        //making sure the values are not null
        if (title.trim() === "" || type.trim() === "" || campaignId.trim() === "") {
            return new Error("title, type, and campaignId should not be empty")
        }

        // Prepare values object
        const values: any = {
            id: nanoid(16),
            title,
            type,
            campaignId,
            read: false,
            createdAt: new Date(),
        }

        // Only add userId if it's not empty
        if (userId && userId.trim() !== "") {
            values.userId = userId;
        }

        //inserting the notification into the database
        await db.insert(notificationTable).values(values).execute()

        console.log("Notification created and added")
    } catch (err) {
        if (process.env.NODE_ENV === "development") console.log(err)
    }
}