import { NextResponse, NextRequest } from "next/server"
import { resetPassword } from "../../../../validations/user"
import { db } from "../../../../db/drizzle"
import { userTable } from "../../../../db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const parsed = resetPassword.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input fields", error: parsed.error.format() },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1)
    if (user.length === 0) {
      return NextResponse.json(
        { error: "User doesn't exist" },
        { status: 404 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await db
      .update(userTable)
      .set({ password: passwordHash })
      .where(eq(userTable.email, email))

  
    return NextResponse.json({
      message:"user password changed",
    }, {status:200 })
  } catch (err) {
    if (process.env.NODE_ENV === "development") console.error(err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
