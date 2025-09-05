import { db } from "@/db/drizzle";
import { campaignTable, userTable, withdrawalTable } from "@/db/schema";
import { campaignCashout, TransferToMainAccount } from "@/lib/monime";
import { withdrawSchema } from "@/validations/withdrawal";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";


function calculateThreePercent(value:number, decimals=4) {
    const threePercent = value * 0.03;
    const remainingValue = value - threePercent;
    
    return {
        amountForMain: Number(threePercent.toFixed(decimals)),
        amountForCashout: Number(remainingValue.toFixed(decimals))
    };
}


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
        console.log(reqBody)

        //validate the body
        const { data, success, error } = withdrawSchema.safeParse(reqBody)
        if(!success){
            return NextResponse.json({
                ok:false,
                message:error.message,
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

        if(data.amount > campaign.amountReceived){
            return NextResponse.json({
                ok:false,
                message:"invalid amount to be cashout"
            }, { status:400 })
        }

        const { amountForMain, amountForCashout } = calculateThreePercent(data.amount)

        const [mainRes, res] = await Promise.all([
            TransferToMainAccount(campaign.financialAccountId as string, amountForMain),
            campaignCashout(amountForCashout, campaign.financialAccountId as string, data.phoneNumber, data.provider)
        ])

        if(!res?.success && !mainRes?.success){
            return NextResponse.json({
                ok:false,
                message:"cashout failed",
            }, { status:500 })
        }

        console.log(res?.result.id)

        await db.insert(withdrawalTable).values({
            id:nanoid(16),
            campaignId:campaign.id,
            userId:user.id,
            monime_id:res?.result.id as string,
            amount:campaign.amountReceived,
            status: "pending",
            paymentDetails: {}
        })

        return NextResponse.json({
            ok:true,
            message:"withdrawal successfull",
        }, { status:200 })

    }catch(err){
        console.log(err)
        return NextResponse.json({
            ok:false,
            message:"internal server error"
        }, { status:500 })
    }
}