import { NextRequest,NextResponse } from "next/server";
import { db } from "../../../../db/drizzle";
import { eq,and } from "drizzle-orm";
import bcrypt from "bcryptjs"
import { registerSchema } from "../../../../validations/user";
import { config } from "../../../../config/config";
import { userTable } from "../../../../db/schema";
import { nanoid } from "nanoid"

export async function POST(req:NextRequest){
  try{
    const body = await req.formData()
    const firstName = body.get("firstName")
    const lastName = body.get("lastName")
    const email = body.get("email")
    const password = body.get("password")
    const phone = body.get("phone")

    const {success, error, data} = registerSchema.safeParse({
      firstName,
      lastName,
      phone,
      password,
      email
    })

    if(!success){
      return NextResponse.json({
        error:"Invalid input body",
        data:error.message[0]
      }, {status:400})
    }

    const user = await db.select().from(userTable).where(and(
      eq(userTable.name, data.firstName+data.lastName),
      eq(userTable.email, data.email)
    ))

    if (user.length >0){
      return NextResponse.json({
        error:"user alread exist",
      },{ status:409 })
    }

    const passwordHash = await bcrypt.hash(data.password, 10)
    
    //creating the new user
    await db.insert(userTable).values({
      id:nanoid(),
      name:data.firstName + data.lastName,
      email: data.email,
      password:passwordHash,
      phone:data.phone,
      role:'user',
    })

    return NextResponse.json({
      message:"user registered successfully",
      ok:true,
    }, { status: 201})
    
  }catch(err){
    config.NODE_ENV === "dev"? console.log(err):""
    return NextResponse.json({
      error:"Internal server error",
    }, { status: 500})
  }
}