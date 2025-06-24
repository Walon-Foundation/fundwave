import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { reason, description, reporterId } = await request.json()

    return NextResponse.json({
      success: true,
      report: {
        id: `report_${Date.now()}`,
        campaignId: params.id,
        reason,
        description,
        reporterId,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      message: "Report submitted successfully. We'll review it within 24 hours.",
    })
  } catch (error) {
    return NextResponse.json({ error: "Report submission failed" }, { status: 400 })
  }
}
