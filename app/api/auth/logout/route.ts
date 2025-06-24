import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Demo logout - clear session/cookies
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })

    // Clear auth cookies
    response.cookies.delete("auth-token")
    response.cookies.delete("user-session")

    return response
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 400 })
  }
}
