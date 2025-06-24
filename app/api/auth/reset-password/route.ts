import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Demo password reset
    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Password reset failed" }, { status: 400 })
  }
}
