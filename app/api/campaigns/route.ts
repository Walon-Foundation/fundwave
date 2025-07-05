// @ts-nocheck
import { NextResponse, NextRequest } from "next/server";
import { createCampaign } from "../../../validations/campaign";
import { supabase } from "../../../lib/supabase";
import { verifyJwt } from "../../../lib/jwt";
import { db } from "../../../db/drizzle";
import { campiagnTable, teamMemberTable } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";




export async function POST(req:NextRequest){
    try{
        // extract token from Authorization header and verify JWT
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];
        if (!token) {
            return NextResponse.json({
                error: "user not authenticated",
            }, { status: 401 });
        }

        const payload = await verifyJwt(token);
        if (!payload || !payload.id) {
            return NextResponse.json({ error: "invalid token" }, { status: 401 });
        }
        if (!payload.isKyc) {
            return NextResponse.json({ error: "KYC not completed" }, { status: 403 });
        }
        const userId = payload.id;

        const body = await req.formData()
        const title = body.get("title")
        const category = body.get("category")
        const targetAmount = body.get("targetAmount")
        const description = body.get("description")
        const fullDescription = body.get("fullDescription")
        const location = body.get("location")
        const endDate = body.get("endDate") as string
        const tag = body.get("tags") as string
        const campaignType = body.get("campaignType")
        const image = body.get("image") as File
        const teamMember = body.get("teamMembers") as string

        const { success,error,data} = createCampaign.safeParse({
            title,
            campaignType,
            category,
            tag: JSON.parse(tag),
            targetAmount: Number(targetAmount),
            description,
            fullDescription,
            location,
            endDate: new Date(endDate),
            teamMembers: JSON.parse(teamMember) || []
        })

        if(!success){
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

        const campaign = await db.select().from(campiagnTable).where(and(eq(campiagnTable.title, data.title),eq(campiagnTable.shortDescription, data.description))).limit(1)
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

        const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;
    
        const [newCampaign] = await db.insert(campiagnTable).values({
            id:nanoid(16),
            title:data.title,
            shortDescription:data.description,
            location:data.location,
            campaignEndDate:data.endDate,
            tags:data.tag,
            fullStory:data.fullDescription,
            fundingGoal:data.targetAmount,
            image:url,
            category:data.category,
            creatorId: userId,
            creatorName: payload.name,
        }).returning()

        if(data.teamMembers?.length! > 0){
            const membersWithCampaignId = data.teamMembers!.map(teamMember =>({
                id:nanoid(16),
                ...teamMember,
                campaignId:newCampaign.id,
            }))
            await db.insert(teamMemberTable).values(membersWithCampaignId)
        }


        return NextResponse.json({
            message:"campaign created",
        }, { status:201 })
    }catch(err){
        process.env.NODE_ENV === "development" ? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}

export async function GET(req:NextRequest){
    try{
        const allCampaign = await db.select().from(campiagnTable)
        if(allCampaign.length === 0){
            return NextResponse.json({
                message:"No campaigns created at yet",
            }, {status:200})
        }
        
        return NextResponse.json({
            message:"all campaigns",
            data:{
                campaigns:allCampaign
            }
        }, { status:200})
    }catch(err){
        process.env.NODE_ENV === "development" ? console.log(err):""
        return NextResponse.json({
            error:"internal server error",
        },{ status:500 })
    }
}