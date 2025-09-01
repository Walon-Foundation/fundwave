import { db } from "@/db/drizzle";
import { campaignTable, userTable, withdrawalTable } from "@/db/schema";
import { campaignCashout } from "@/lib/monime";
import { sendEmail } from "@/lib/nodeMailer";
import { withdrawSchema } from "@/validations/withdrawal";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest, {params}:{params:Promise<{id:string}>}){
    try{
        const { userId:clerkId } = await auth()
        const user = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId as string)).limit(1).execute())[0]
        if (!user || !clerkId){
            return NextResponse.json({
                ok:false,
                message:"user is not authenticated",
            }, { status:401 })
        }

        const reqBody = await req.json()

        //validate the body
        const { data, success, error } = withdrawSchema.safeParse(reqBody)
        if(!success){
            return NextResponse.json({
                ok:false,
                message:"invalid body",
            }, { status:400 })
        }

        //getting the id from the params
        const id = (await params).id

        //getting the campaign
        const campaign = (await db.select().from(campaignTable).where(eq(campaignTable.id, id)).limit(1).execute())[0]

        if(!campaign || campaign.amountReceived === 0 ){
            return NextResponse.json({
                ok:false,
                message:"invalid campaign"
            }, { status:400 })
        }

        const res = await campaignCashout(campaign.amountReceived, campaign.financialAccountId as string, data.phoneNumber)
        if(res?.success){
            await Promise.all([
                //save to withdraw table and send email of withdraw successfull
                db.insert(withdrawalTable).values({
                    id:nanoid(16),
                    campaignId:campaign.id,
                    userId:user.id,
                    amount:campaign.amountReceived,
                    status: "completed",
                    paymentDetails: {

                    }
                }),
                sendEmail('payout-sent', user.email, "Withdrawal was successfull", { name:user.name, amount:campaign.amountReceived})
            ])
        }

        return NextResponse.json({
            ok:true,
            message:"withdrawal successfull",
        }, { status:200 })

    }catch(err){
        return NextResponse.json({
            ok:false,
            message:"internal server error"
        }, { status:500 })
    }
}