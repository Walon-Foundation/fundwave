import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server";
import { kycSchema } from "../../../../validations/user";
import { db } from "../../../../db/drizzle";
import { userDocumentTable, userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "../../../../lib/supabase";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/nodeMailer";


export async function PATCH(req:NextRequest){
  try{
    //authenticating the user
    const { userId } = await auth();
    // if (!userId) {
    //   console.log("no auth")
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    //getting the user details from clerk
    // const user = (await clerkClient()).users.getUser(userId)

    const userExist = await db.select().from(userTable).where(eq(userTable.clerkId, userId!)).limit(1)
    
    if(!userId || userExist.length === 0){
      console.log("user nor dea")
      return NextResponse.json({
        error:"user auth token is invalid",
      }, { status:401 })
    }

    if(userExist[0].isKyc){
      return NextResponse.json({
        message:"user has already done the kyc",
      }, { status:200 })
    }

    //getting the value
    const body = await req.formData()

    const address =  body.get("address")
    const district =   body.get("district")
    const documentType =  body.get("documentType")
    const documentNumber =  body.get("documentNumber")
    const occupation =  body.get("occupation")
    const nationality =  body.get("nationality")
    const age =  body.get("age")
    const phoneNumber = body.get("phoneNumber")
    const profilePicture =  body.get("profilePicture") as File
    const documentPhoto =  body.get("documentPhoto") as File

    if(profilePicture.size > 5 * 1024* 1024 || documentPhoto.size > 5 * 1024 * 1024){
      return NextResponse.json({
        error:"user profile picture and document photo too large",
      }, { status:400 })
    }

    const {error,success, data } = kycSchema.safeParse({
      address,
      district,
      documentType,
      documentNumber,
      occupation,
      nationality,
      phoneNumber,
      age:Number(age)
    })

    if(!success){
      return NextResponse.json({
        message:"invalid data type",
        error:error.format()
      }, { status:400 })
    }

    const profilePhotoName = `${userExist[0].name}`
    const documentPhotoName = `${userExist[0].name}`

    const profileBuffer = Buffer.from(await profilePicture.arrayBuffer())
    const documentPhotoBuffer = Buffer.from(await documentPhoto.arrayBuffer())
  
    const { data:uploadData, error:uploadError }  = await supabase.storage.from("profiles").upload(profilePhotoName, profileBuffer,{
      contentType:profilePicture.type,
      upsert:false,
    })

    const {data:uploadDocumentData, error:uploadDocumentError } = await supabase.storage.from("documents").upload(documentPhotoName,documentPhotoBuffer,{
      contentType:documentPhoto.type,
      upsert:false,
    })

    if(uploadError){
      console.log(uploadError.message)
      return NextResponse.json({
        error:"fail to upload profile picture",
      }, { status:500 })
    }

    if(uploadDocumentError){
      console.log(uploadDocumentError.message)
      return NextResponse.json({
        error:"failed to upload document picture"
      }, { status:500 })
    }

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;
    const documentUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${uploadDocumentData.fullPath}`

    const newUser = await db.update(userTable).set({
      isKyc:true,
      isVerified:true,
      occupation:data.occupation,
      address:data.address,
      age:data.age,
      nationality:data.nationality,
      profilePicture:url,
      district:data.district,
      phone:data.phoneNumber
    }).where(eq(userTable.clerkId, userId)).returning()
    

   //saving the document and sending the email
   await Promise.all([
      db.insert(userDocumentTable).values({
        documentNumber:data.documentNumber,
        documentPhoto:documentUrl,
        documentType:data.documentType,
        id:nanoid(16),
        userId:newUser[0].id
      }),
      sendEmail("kyc-complete", newUser[0].email, "Kyc has being completed", { name: newUser[0].name })
   ])

    return NextResponse.json({
      message:"kyc completed successfull",
    }, {status:200})

  }catch(err){
    process.env.NODE_ENV === "development" ? console.log(err):""
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}