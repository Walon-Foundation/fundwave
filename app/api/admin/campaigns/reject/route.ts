import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { campaignId, adminId, reason } = await request.json()

    return NextResponse.json({
      success: true,
      rejection: {
        campaignId,
        adminId,
        status: "rejected",
        reason,
        rejectedAt: new Date().toISOString(),
      },
      message: "Campaign rejected successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Campaign rejection failed" }, { status: 400 })
  }
}
