import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../../../../../db/drizzle";
import { userTable, paymentTable, campiagnTable } from "../../../../../db/schema";
import createPaymentCode from "../../../../../lib/generateCode";
import { createCode } from "../../../../../validations/payment";

export async function POST(req: NextRequest, {params}:{params:Promise<{id:string}>}) {
    try {
        const body = await req.json();

        // Validate required fields
        const {error, success, data} = createCode.safeParse(body)
        if(!success){
            return NextResponse.json({
                message:"invalid input data",
                error:error.format(),
            }, { status:400 })
        }

        //getting the campaign name
        const id = (await params).id
        const campaign = await db.select({title:campiagnTable.title}).from(campiagnTable).where(eq(campiagnTable.id, id)).limit(1).execute()

        let userId: string | null = null;
        let userName: string = "Anonymous";

        // Check if user is authenticated
        const token = (await cookies()).get("accessToken")?.value;
        if (token) {
            try {
                const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id: string };
                userId = decodedUser.id;
                
                // Fetch user from database
                const user = await db.select({
                    name: userTable.name
                })
                .from(userTable)
                .where(eq(userTable.id, userId))
                .limit(1)
                .execute();

                if (user[0]?.name) {
                    userName = user[0].name;
                }
            } catch (authError) {
                // If token verification fails, treat as anonymous
                console.log("Authentication failed, proceeding as anonymous");
            }
        }

        // Generate payment code
        const paymentCode = await createPaymentCode(
            campaign[0].title,
            userName,
            data.amount,
            data.phone
        );

        if (!paymentCode || !paymentCode.success) {
            return NextResponse.json({
                error: "Failed to generate payment code"
            }, { status: 500 });
        }

        // Save payment to database
        await db.insert(paymentTable).values({
            id: nanoid(16),
            userId: userId, 
            amount: Number(data.amount),
            campaignId: id,
            monimeId: paymentCode.result.id,
            isCompleted: false,
        }).execute();


        return NextResponse.json({
            success: true,
            paymentCode: paymentCode.result.ussdCode,
        }, { status:201 });

    } catch (err) {
        process.env.NODE_ENV === "development" ? console.log(err) : "";
        return NextResponse.json({
            error: "internal server error",
        }, { status: 500 });
    }
}