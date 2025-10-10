import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server";
import { createCampaign } from "@/validations/campaign";
import { supabase } from "@/lib/supabase";
import { db } from "@/db/drizzle";
import { campaignTable, teamMemberTable, userTable, platformSettingsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/nodeMailer";
import { createAccount } from "@/lib/monime";


export async function POST(req:NextRequest){
    try{
        //authenticating the user
        const { userId:clerkId } = await auth();
        const userExist = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId as string)).limit(1).execute())[0]
        
        if(!userExist || !clerkId){
        return NextResponse.json({
            error:"user is not authenticated",
        }, { status:401 })
        }
        
        const userId = userExist.id;

        const body = await req.formData()
        const title = body.get("title")
        const category = body.get("category")
        const fundingGoal = body.get("fundingGoal")
        const shortDescription = body.get("shortDescription")
        const location = body.get("location")
        // removed deprecated fields: problem, solution, impact
        const endDate = body.get("campaignEndDate") as string
        const tag = body.get("tags") as string
        // removed campaignType from payload; default will be applied
        const image = body.get("image") as File
        // removed team members from payload

        const { success,error,data} = createCampaign.safeParse({
            title,
            category,
            tag: JSON.parse(tag),
            fundingGoal: Number(fundingGoal),
            shortDescription,
            location,
            endDate: new Date(endDate),
        })

        // Ensure campaignEndDate is strictly in the future
        const now = new Date();
        if (new Date(endDate) <= now) {
            return NextResponse.json({
                message: "campaignEndDate must be later than the current time",
            }, { status: 400 })
        }

        if(!success){
            return NextResponse.json({
                message:"invalid input campaign data",
                error:error.format(),
            }, { status:400 })
        }

        if(image.size > 50 *1024 * 1024 ){
            return NextResponse.json({
                message:"image is to large",
            }, { status:400 })
        }

        const campaign = await db.select().from(campaignTable).where(and(eq(campaignTable.title, data.title),eq(campaignTable.shortDescription, data.shortDescription))).limit(1)
        if(campaign.length > 0){
            return NextResponse.json({
                message:"campaign already exist",
            }, { status:409 })
        }

        const buffer = Buffer.from(await image.arrayBuffer())
        const filePath = `${data.title}`

        const { error:uploadError } = await supabase.storage.from("campaigns").upload(filePath, buffer,{
            contentType:image.type,
            upsert:true,
        })

        const { data:signedUrlData } = await  supabase.storage.from("campaigns").createSignedUrl(filePath, 60 * 60 * 24 * 365 * 2)

        if(uploadError || !signedUrlData){
            return NextResponse.json({
                message:"failed to upload image",
            }, { status: 500})
        }

        const response = await createAccount(data.title)
        if(!response?.success){
            return NextResponse.json({
                ok:false,
                message:"failed to created campaign account"
            },{ status:500 })
        }
    
        // Determine initial status from platform settings
        let initialStatus: any = 'active'
        try {
            const [settings] = await db.select().from(platformSettingsTable).where(eq(platformSettingsTable.id, 'default')).limit(1)
            if ((settings as any)?.config?.requireApproval) initialStatus = 'pending'
        } catch {}

        const [newCampaign] = await db.insert(campaignTable).values({
            id:nanoid(16),
            title:data.title,
            shortDescription:data.shortDescription,
            location:data.location,
            campaignEndDate:data.endDate,
            tags:data.tag,
            fundingGoal:data.fundingGoal,
            image:signedUrlData.signedUrl,
            financialAccountId:response.result.id,
            category:data.category,
            creatorId: userId,
            // DB requires campaignType; set a default value to satisfy constraint
            campaignType: 'personal' as any,
            creatorName: userExist.name,
            status: initialStatus,
        }).returning()


        //send email to confirm campaign creation
        await sendEmail("campaign-created", userExist.email, "Campaign has been created", { name: userExist.name, campaign:newCampaign.title })

        //sending the response to client
        return NextResponse.json({
            message:"campaign created",
        }, { status:201 })

    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}

export async function GET(){
    try{
        const allCampaign = await db.select().from(campaignTable)
        if(allCampaign.length === 0){
            return NextResponse.json({
                message:"No campaigns created at yet",
            }, {status:200})
        }
        
        return NextResponse.json({
            message:"all campaigns",
            data:allCampaign,
        }, { status:200})
    }catch(err){
        return NextResponse.json({
            error:"internal server error",
        },{ status:500 })
    }
}