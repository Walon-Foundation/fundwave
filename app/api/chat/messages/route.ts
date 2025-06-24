import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const campaignId = searchParams.get("campaignId")

  return NextResponse.json({
    messages: [
      {
        id: "msg1",
        campaignId,
        userId: "user1",
        userName: "John Doe",
        message: "Great project!",
        timestamp: new Date().toISOString(),
      },
    ],
  })
}

export async function POST(request: Request) {
  try {
    const { campaignId, userId, userName, message } = await request.json()

    return NextResponse.json({
      success: true,
      message: {
        id: `msg_${Date.now()}`,
        campaignId,
        userId,
        userName,
        message,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 400 })
  }
}
