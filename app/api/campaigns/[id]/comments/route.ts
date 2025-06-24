import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    comments: [
      {
        id: "comment1",
        campaignId: params.id,
        userId: "user1",
        userName: "John Doe",
        content: "Great initiative!",
        createdAt: new Date().toISOString(),
      },
    ],
  })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { content, userId } = await request.json()

    return NextResponse.json({
      success: true,
      comment: {
        id: `comment_${Date.now()}`,
        campaignId: params.id,
        userId,
        content,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 400 })
  }
}
