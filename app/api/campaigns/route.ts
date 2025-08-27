import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server";
import { createCampaign } from "../../../validations/campaign";
import { supabase } from "../../../lib/supabase";
import { db } from "../../../db/drizzle";
import { campaignTable, teamMemberTable, userTable } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/nodeMailer";
import { createAccount } from "@/lib/monime";


export async function POST(req:NextRequest){
    try{
        //authenticating the user
        const { userId:clerkId } = await auth();
        if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userExist = await db.select().from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1)
        
        if(userExist.length === 0){
        return NextResponse.json({
            error:"user auth token is invalid",
        }, { status:401 })
        }
        
        const userId = userExist[0].id;

        const body = await req.formData()
        const title = body.get("title")
        const category = body.get("category")
        const fundingGoal = body.get("fundingGoal")
        const shortDescription = body.get("shortDescription")
        const location = body.get("location")
        const problem = body.get("problem")
        const solution = body.get("solution")
        const impact = body.get("impact")
        const endDate = body.get("campaignEndDate") as string
        const tag = body.get("tags") as string
        const campaignType = body.get("campaignType")
        const image = body.get("image") as File
        const teamMember = body.get("teamMembers") as string

        const { success,error,data} = createCampaign.safeParse({
            title,
            campaignType,
            category,
            tag: JSON.parse(tag),
            fundingGoal: Number(fundingGoal),
            shortDescription,
            location,
            problem,
            impact,
            solution,
            endDate: new Date(endDate),
            teamMembers: JSON.parse(teamMember) || []
        })

        if(!success){
            console.log("error 1")
            console.log(error)
            return NextResponse.json({
                message:"invalid input campaign data",
                error:error.format(),
            }, { status:400 })
        }

        if(image.size > 5 *1024 * 1024 ){
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

        const {data:uploadData, error:uploadError } = await supabase.storage.from("campaigns").upload(filePath, buffer,{
            contentType:image.type,
            upsert:true,
        })

        if(uploadError){
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

        const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;
    
        const [newCampaign] = await db.insert(campaignTable).values({
            id:nanoid(16),
            title:data.title,
            shortDescription:data.shortDescription,
            location:data.location,
            campaignEndDate:data.endDate,
            tags:data.tag,
            problem:data.problem,
            solution:data.solution,
            impact:data.impact,
            fundingGoal:data.fundingGoal,
            image:url,
            financialAccountId:response.result.id,
            category:data.category,
            creatorId: userId,
            campaignType:data.campaignType,
            creatorName: userExist[0].name,
        }).returning()

        if((data?.teamMembers ?? []).length > 0){
            const membersWithCampaignId = (data.teamMembers ?? []).map(teamMember =>({
                id:nanoid(16),
                ...teamMember,
                campaignId:newCampaign.id,
            }))
            await db.insert(teamMemberTable).values(membersWithCampaignId)
        }

        //send email to confirm campaign creation
        await sendEmail("campaign-created", userExist[0].email, "Campaign has been created", { name: userExist[0].name, campaign:newCampaign.title })

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
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error:"internal server error",
        },{ status:500 })
    }
}