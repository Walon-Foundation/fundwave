import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/nodeMailer";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const webhookSecret = process.env.WEBHOOK_SECRET;
        if (!webhookSecret) throw new Error("Missing Clerk webhook secret");

        const svix_id = req.headers.get("svix-id");
        const svix_timestamp = req.headers.get("svix-timestamp");
        const svix_signature = req.headers.get("svix-signature");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return NextResponse.json({ ok: false, message: "Invalid headers" }, { status: 400 });
        }

        const payload = await req.text();
        const wh = new Webhook(webhookSecret);

        let evt:any 
        try {
            evt = wh.verify(payload, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp,
            });
        } catch (err) {
            console.error(err);
            return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 400 });
        }

        const { type, data } = evt;

        if (type === "user.created") {
            // Check if already exists
            const existing = await db.select()
                .from(userTable)
                .where(eq(userTable.clerkId, data.id))
                .limit(1);

            if (existing.length === 0) {
                await db.insert(userTable).values({
                    id: nanoid(16),
                    clerkId: data.id,
                    name: `${data.first_name} ${data.last_name}`,
                    email: data.email_addresses[0].email_address,
                    profilePicture: data.profile_image_url
                });

                if (process.env.NODE_ENV === "development") {
                    console.log("user added to the database from the hook");
                }

                // Send welcome email
                await sendEmail(
                    "welcome",
                    data.email_addresses[0].email_address,
                    "Welcome to Fundwave",
                    { name: data.first_name }
                );
            } else {
                if (process.env.NODE_ENV === "development") {
                    console.log("duplicate webhook ignored");
                }
            }
        }

        return NextResponse.json({ ok: true, message: "hook received" }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ ok: false, message: "Webhook failed" }, { status: 500 });
    }
}
