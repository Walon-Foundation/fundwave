import { NextRequest,NextResponse } from "next/server";
import { db } from "../../../../db/drizzle";
import { eq,and } from "drizzle-orm";
import bcrypt from "bcryptjs"
import { registerSchema } from "../../../../validations/user";
import { emailVerifcationTable, userTable } from "../../../../db/schema";
import { nanoid } from "nanoid"
import { verifyEmail } from "../../../../lib/nodeMailer";

export async function POST(req:NextRequest){
  try{
    const body =  await req.json()
    
    const {success, error, data} = registerSchema.safeParse(body)

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

    const token = nanoid(16)
    
    //creating the new user
    await Promise.all([
      await db.insert(userTable).values({
        id:nanoid(),
        name:`${data.firstName} + ${data.lastName}`,
        email: data.email,
        password:passwordHash,
        phone:data.phone,
        role:'user',
      }),
      await verifyEmail(`${data.firstName + data.lastName}`, "Verification of Email", data.email, token ),
      await db.insert(emailVerifcationTable).values({
        id:nanoid(),
        token:token,
        userEmail:data.email
      })
    ])

    return NextResponse.json({
      message:"user registered successfully",
      ok:true,
    }, { status: 201})
    
  }catch(err){
    process.env.NODE_ENV === "development"? console.log(err):""
    return NextResponse.json({
      error:"Internal server error",
    }, { status: 500})
  }
}