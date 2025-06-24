import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    // Demo email verification
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: "user1",
        email: "user@example.com",
        emailVerified: true,
        verifiedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Email verification failed" }, { status: 400 })
  }
}
