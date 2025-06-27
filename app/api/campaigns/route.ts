import { NextResponse, NextRequest } from "next/server";
import { createCampaign } from "../../../validations/campaign";
import { supabase } from "../../../lib/supabase";
import { db } from "../../../db/drizzle";
import { campiagnTable, teamMemberTable } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"


export async function POST(req:NextRequest){
    try{
        //get the user id from the cookie
        const token = (await cookies()).get("accessToken")?.value
        if(!token){
            return NextResponse.json({
                error:"user not authenticated",
            },{ status:401 })
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id:string}
        if(!user){
            return NextResponse.json({
                error:"invalid token"
            }, { status:401 })
        }

        const body = await req.formData()
        const title = body.get("title")
        const category = body.get("category")
        const targetAmount = body.get("targetAmount")
        const description = body.get("description")
        const fullDescription = body.get("fullDescription")
        const location = body.get("location")
        const endDate = body.get("endDate")
        const tag = body.get("tags") as string
        const campaignType = body.get("campaignType")
        const image = body.get("image") as File
        const teamMember = body.get("teamMembers") as string

        const { success,error,data} = createCampaign.safeParse({
            title,
            campaignType,
            category,
            tag: JSON.parse(tag),
            targetAmount,
            description,
            fullDescription,
            location,
            endDate,
            teamMembers: JSON.parse(teamMember),
        })

        if(!success){
            return NextResponse.json({
                message:"invalid input campaign data",
                error:error.format(),
            }, { status:400 })
        }

        if(image.size > 5 *1024 ){
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

        await db.transaction(async(tx) => {
            const [newCampaign] = await tx.insert(campiagnTable).values({
                id:nanoid(16),
                title:data.title,
                shortDescription:data.description,
                location:data.location,
                campaignEndDate:data.endDate,
                tags:data.tag,
                fullStory:data.fullDescription,
                fundingGoal:data.targetAmount,
                image:uploadData.fullPath,
                category:data.category,
                creatorId:user.id,
            }).returning()

            if(data.teamMembers?.length! > 0){
                const membersWithCampaignId = data.teamMembers!.map(teamMember =>({
                    id:nanoid(16),
                    ...teamMember,
                    campaignId:newCampaign.id,
                }))
                await tx.insert(teamMemberTable).values(membersWithCampaignId)
            }
        })


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