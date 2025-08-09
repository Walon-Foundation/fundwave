import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../../../../../db/drizzle";
import { userTable, paymentTable, campaignTable } from "../../../../../db/schema";
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
        const campaign = await db.select({title:campaignTable.title}).from(campaignTable).where(eq(campaignTable.id, id)).limit(1).execute()

        //getting the user id if the user exist in the database
        const user = await db.select().from(userTable).where(and(eq(userTable.name, data.name!), eq(userTable.email, data.email!))).limit(1).execute()

        // Generate payment code
        const paymentCode = await createPaymentCode(
            campaign[0].title,
            data.name || "",
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
            userId: user[0].id, 
            amount: Number(data.amount),
            campaignId: id,
            username:data.name || "Anonymous",
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
        process.env.NODE_ENV === "development"? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}