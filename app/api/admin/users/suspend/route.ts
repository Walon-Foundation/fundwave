import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, reason, duration } = await request.json()

    return NextResponse.json({
      success: true,
      suspension: {
        id: `suspension_${Date.now()}`,
        userId,
        reason,
        duration,
        suspendedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      },
      message: "User suspended successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "User suspension failed" }, { status: 400 })
  }
}
