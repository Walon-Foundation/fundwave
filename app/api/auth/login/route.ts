import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Demo authentication logic
    if (email === "admin@fundwavesl.com" && password === "admin123") {
      return NextResponse.json({
        success: true,
        user: { id: "admin1", email, role: "admin", name: "Admin User" },
        token: "demo-admin-token",
      })
    }

    // Regular user demo
    return NextResponse.json({
      success: true,
      user: { id: "user1", email, role: "user", name: "Demo User" },
      token: "demo-user-token",
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 400 })
  }
}
