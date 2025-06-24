import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { platform, userId } = await request.json()

    // Demo share tracking
    return NextResponse.json({
      success: true,
      shareId: `share_${Date.now()}`,
      campaignId: params.id,
      platform,
      userId,
      shareUrl: `https://fundwavesl.com/campaigns/${params.id}?ref=${userId}`,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Share tracking failed" }, { status: 400 })
  }
}
