import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server";
import { kycSchema } from "@/validations/user";
import { db } from "@/db/drizzle";
import { userDocumentTable, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/nodeMailer";


export async function PATCH(req:NextRequest){
  try{
    //authenticating the user
    const { userId } = await auth();
    const userExist = (await db.select().from(userTable).where(eq(userTable.clerkId, userId!)).limit(1).execute())[0]
    
    if(!userId || !userExist){
      return NextResponse.json({
        error:"user auth token is invalid",
      }, { status:401 })
    }

    if(userExist.isKyc){
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
    const bio = body.get("bio")
    const name = body.get("name")
    const profilePicture =  body.get("profilePicture") as File
    const documentPhoto =  body.get("documentPhoto") as File

    if(profilePicture.size > 50 * 1024* 1024 || documentPhoto.size > 50 * 1024 * 1024){
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
      age:Number(age),
      bio,
      name
    })

    if(!success){
      return NextResponse.json({
        message:"invalid data type",
        error:error.format()
      }, { status:400 })
    }

    const profilePhotoName = `${userExist.name}`
    const documentPhotoName = `${userExist.name}`

    const profileBuffer = Buffer.from(await profilePicture.arrayBuffer())
    const documentPhotoBuffer = Buffer.from(await documentPhoto.arrayBuffer())
  

    const { error:uploadError }  = await supabase.storage.from("profiles").upload(profilePhotoName, profileBuffer,{
      contentType:profilePicture.type,
      upsert:false,
    })

    const { error:uploadDocumentError } = await supabase.storage.from("documents").upload(documentPhotoName,documentPhotoBuffer,{
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

    const {data:signUrlProfileData} = await supabase.storage.from("profiles").createSignedUrl(profilePhotoName, 60 * 60 * 23 * 365 * 2)
    const {data:signUrlDocumentData} = await supabase.storage.from("profiles").createSignedUrl(documentPhotoName, 60 * 60 * 23 * 365 * 2) 

    if(!signUrlDocumentData || !signUrlProfileData){
      return NextResponse.json({
        ok:false,
        message:"failed to created signedurl",
      }, { status:500 })
    }

    const newUser = (await db.update(userTable).set({
      isKyc:true,
      name:data.name,
      isVerified:true,
      occupation:data.occupation,
      address:data.address,
      age:data.age,
      nationality:data.nationality,
      profilePicture:signUrlProfileData.signedUrl,
      district:data.district,
      phone:data.phoneNumber,
      bio:data.bio
    }).where(eq(userTable.clerkId, userId)).returning())[0]
    

   //saving the document and sending the email
   await Promise.all([
      db.insert(userDocumentTable).values({
        documentNumber:data.documentNumber,
        documentPhoto:signUrlDocumentData.signedUrl,
        documentType:data.documentType,
        id:nanoid(16),
        userId:newUser.id
      }),
      sendEmail("kyc-complete", newUser.email, "Kyc has being completed", { name: newUser.name })
   ])

    return NextResponse.json({
      message:"kyc completed successfull",
    }, {status:200})

  }catch(err){
    if (process.env.NODE_ENV === "development") console.log(err)
    return NextResponse.json({
      error:"internal server error",
    }, { status:500 })
  }
}