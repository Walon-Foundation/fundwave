import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Demo password reset
    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reset link" }, { status: 400 })
  }
}
