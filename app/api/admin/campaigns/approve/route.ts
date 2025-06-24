import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { campaignId, adminId, notes } = await request.json()

    return NextResponse.json({
      success: true,
      approval: {
        campaignId,
        adminId,
        status: "approved",
        notes,
        approvedAt: new Date().toISOString(),
      },
      message: "Campaign approved successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Campaign approval failed" }, { status: 400 })
  }
}
