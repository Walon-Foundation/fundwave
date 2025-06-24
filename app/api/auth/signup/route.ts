import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone } = await request.json()

    // Demo user creation
    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      phone,
      role: "user",
      kycStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "Account created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 400 })
  }
}
