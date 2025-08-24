import { NextResponse, NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db/drizzle";
import { userTable, paymentTable, campaignTable } from "@/db/schema";
import createPaymentCode from "@/lib/monime";
import { createCode } from "@/validations/payment";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest, {params}:{params:Promise<{id:string}>}) {
    try {
        const body = await req.json();

        const { userId:clerkId } = await auth()

        // Validate required fields
        const {error, success, data} = createCode.safeParse(body)
        if(!success){
            console.log(error)
            return NextResponse.json({
                message:"invalid input data",
                error:error.format(),
            }, { status:400 })
        }

        //getting the campaign name
        const id = (await params).id
        const campaign = (await db.select({title:campaignTable.title, financialAccountId:campaignTable.financialAccountId}).from(campaignTable).where(eq(campaignTable.id, id)).limit(1).execute())[0]

        //getting the user id if the user exist in the database
        const user = (await db.select().from(userTable).where(and(eq(userTable.clerkId, clerkId as string))).limit(1).execute())[0]

        // Generate payment code
        const paymentCode = await createPaymentCode(
            campaign.title,
            data.name || "",
            data.amount,
            data.phone,
            campaign.financialAccountId as string
        );

        if (!paymentCode || !paymentCode.success) {
            return NextResponse.json({
                error: "Failed to generate payment code"
            }, { status: 500 });
        }

        if(!user){
            await db.insert(paymentTable).values({
                id: nanoid(16),
                amount: Number(data.amount),
                campaignId: id,
                username:data.name || "Anonymous",
                monimeId: paymentCode.result.id,
                isCompleted: false,
                email:data.email
            }).execute();
        }else {
            await db.insert(paymentTable).values({
                id: nanoid(16),
                userId:user.id,
                amount: Number(data.amount),
                campaignId: id,
                username:data.name || "Anonymous",
                monimeId: paymentCode.result.id,
                isCompleted: false,
                email:data.email
            }).execute();
        }    


        return NextResponse.json({
            success: true,
            data: paymentCode.result.ussdCode,
        }, { status:201 });

    } catch (err) {
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error: "internal server error",
        }, { status: 500 });
    }
}



export async function GET(req:NextRequest, {params}:{params:Promise<{id:string}>}){
    try{
        const id = (await params).id
        const payments  = await db.select().from(paymentTable).where(eq(paymentTable.campaignId, id))

        if(payments.length === 0){
            return NextResponse.json({
                message:"No donations at yet",
            }, { status:200 })
        }

        return NextResponse.json({
            message:"all donation for this campaign",
            data:{
                donations:payments,
            }
        }, { status:200 })

    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}