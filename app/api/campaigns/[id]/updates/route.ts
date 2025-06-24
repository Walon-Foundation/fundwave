import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    updates: [
      {
        id: "update1",
        campaignId: params.id,
        title: "Project Progress Update",
        content: "We've made significant progress...",
        createdAt: new Date().toISOString(),
      },
    ],
  })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, content, images } = await request.json()

    return NextResponse.json({
      success: true,
      update: {
        id: `update_${Date.now()}`,
        campaignId: params.id,
        title,
        content,
        images,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create update" }, { status: 400 })
  }
}
