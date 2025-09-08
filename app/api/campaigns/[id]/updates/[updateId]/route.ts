import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../db/drizzle";
import { campaignTable, updateTable, userTable } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { sendNotification } from "@/lib/notification";
import { createUpdate } from "@/validations/update";
import { supabase } from "@/lib/supabase";


export async function DELETE(req:NextRequest, {params}:{params:Promise<{updateId:string}>}){
    try{
        const { userId } = await auth()
        const user = (await db.select().from(userTable).where(eq(userTable.clerkId, userId as string)).limit(1))[0]

        if(!userId || !user){
            return NextResponse.json({
                ok:false,
                message:"user is not authenticated",
            }, { status:401 })
        }
    
        const updateId  = (await params).updateId
        
        const [update] = await db.select().from(updateTable).where(eq(updateTable.id, updateId)).limit(1)
        if(!update){
            return NextResponse.json({
                error:"update doesn't exist",
            }, { status:404 })
        }

        const [campaign] = await db.select().from(campaignTable).where(eq(campaignTable.id, update.campaignId))
        if(!campaign){
            return NextResponse.json({
                error:"campaign not found",
            }, { status:404 })
        }

        if(campaign.creatorId !== user.id){
            return NextResponse.json({
                error:"unauthorized: Not the campaign creator"
            }, { status:401 })
        }

        //deleting both the update and update image if there is images
        await Promise.all([
            db.delete(updateTable).where(eq(updateTable.id, updateId)),
            supabase.storage.from("updates").remove([update.title])
        ])

        return NextResponse.json({
            ok:true,
            message:"update deleted successfully",
        }, { status:200 })
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            error:"internal server error",
        }, { status:500 })
    }
}



export async function PATCH(req:NextRequest, {params}:{params:Promise<{updateId:string}>}){
    try{
        const { userId:clerkId } = await auth()
        const user = (await db.select().from(userTable).where(eq(userTable.clerkId, clerkId!)).limit(1).execute())[0]

        if(!user || !clerkId){
            return NextResponse.json({
                ok:false,
                message:"user is not authenticated",
            }, { status:401 })
        }

        const updateId = (await params).updateId

        const reqBody = await req.formData()

        const title = reqBody.get("title")
        const content = reqBody.get("content")
        const image = reqBody.get("image") as File

        const { success, data, error } = createUpdate.safeParse({
            title,
            content
        })

        if(!success){
        if (process.env.NODE_ENV === "development") console.log(error.message)
            return NextResponse.json({
                ok:false,
                message:"invalid request body",
            }, { status:400 })
        }

        const oldUpdate = (await db.select().from(updateTable).where(eq(updateTable.id, updateId)).limit(1).execute())[0]

        let signedUrl = oldUpdate.image

        if(image && image.size > 0){
            if(image.size > 50 * 1024 * 1024){
                return NextResponse.json({
                    ok:false,
                    message:"image size is larger than 50mb",
                }, { status:400 })
            }


           if(oldUpdate.image !== ""){
                const { error:removeError } = await supabase.storage.from("updates").remove([oldUpdate.title])
                if(removeError){
                    console.log("error from delete")
                    console.log(removeError)
                    return NextResponse.json({
                        ok:false,
                        message:"failed to remove old update image",
                    }, { status:500 })
                }
           }

            const FILEPATH = data.title as string
            const buffer = Buffer.from(await image.arrayBuffer())

            const { error:uploadError } = await supabase.storage.from("updates").upload(FILEPATH, buffer, {
                contentType:image.type,
                upsert:false
            })

            if(uploadError){
                console.log(uploadError)
                return NextResponse.json({
                    ok:false,
                    message:"failed to upload images"
                }, { status:500 })
            }

            const { data:signedUrlData } = await supabase.storage.from("updates").createSignedUrl(FILEPATH, 60 * 60 * 24 * 365 * 2)
            if(!signedUrlData){
                console.log("no sign url")
                return NextResponse.json({
                    ok:false,
                    message:"failed to created signedurl",
                }, { status:500 })
            }

            signedUrl = signedUrlData.signedUrl
        }

        const newUpdate = (await db.update(updateTable).set({ 
            title:data.title, 
            message:data.content,
            image:signedUrl, 
            updatedAt:new Date()
        }).where(eq(updateTable.id, updateId)).returning().execute())[0]

        await sendNotification("update updated", "update", user.id, newUpdate.campaignId)

        return NextResponse.json({
            ok:true,
            message:"updated update",
            data:newUpdate
        }, { status:200 })
        
    }catch(err){
        if (process.env.NODE_ENV === "development") console.log(err)
        return NextResponse.json({
            ok:false,
            message:"internal server error",
        }, { status:500 })
    }
}