import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { platform, userId } = await request.json()

    // Demo share tracking
    return NextResponse.json({
      success: true,
      shareId: `share_${Date.now()}`,
      campaignId: (await params).id,
      platform,
      userId,
      shareUrl: `https://fundwavesl.com/campaigns/${(await params).id}?ref=${userId}`,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Share tracking failed" }, { status: 400 })
  }
}
