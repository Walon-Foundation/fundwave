import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"
import { kycSchema } from "../../../../validations/user";
import { db } from "../../../../db/drizzle";
import { userTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { supabase } from "../../../../lib/supabase";


export async function PATCH(req:NextRequest){
  try{
    //auth
    const token = (await cookies()).get("accessToken")?.value
    if(!token){
      return NextResponse.json({
        error:"user is not authenticated",
      }, { status:401 })
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN!) as { id:string }
    const userExist = await db.select().from(userTable).where(eq(userTable.id, user.id)).limit(1)
    
    if(!user || userExist.length === 0){
      return NextResponse.json({
        error:"user auth token is invalid",
      }, { status:401 })
    }

    if(userExist[0].isKyc){
      return NextResponse.json({
        message:"user has already done the kyc",
      }, {status:400 })
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
      age:Number(age)
    })

    if(!success){
      return NextResponse.json({
        message:"invalid data type",
        error:error.format()
      }, { status:400 })
    }

    const profilePhotoName = `${userExist[0].name}`
    // const documentPhotoName = `${userExist[0].name}`

    const profileBuffer = Buffer.from(await profilePicture.arrayBuffer())
    // const documentPhotoBuffer = Buffer.from(await documentPhoto.arrayBuffer())
  
    const { data:uploadData, error:uploadError }  = await supabase.storage.from("profiles").upload(profilePhotoName, profileBuffer,{
      contentType:profilePicture.type,
      upsert:false,
    })

    if(uploadError){
      console.log(uploadError.message)
      return NextResponse.json({
        error:"fail to upload profile picture",
      }, { status:500 })
    }

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${uploadData.fullPath}`;

    await db.update(userTable).set({
      isKyc:true,
      address:data.address,
      age:data.age,
      nationality:data.nationality,
      district:data.district,
      documentNumber:data.documentNumber,
      documentType:data.documentType,
      profilePicture:url,
      occupation:data.occupation,
    }).where(eq(userTable.id, user.id))

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