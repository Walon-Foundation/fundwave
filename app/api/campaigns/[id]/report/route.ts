import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { reason, description, reporterId } = await request.json()

    return NextResponse.json({
      success: true,
      report: {
        id: `report_${Date.now()}`,
        campaignId: (await params).id,
        reason,
        description,
        reporterId,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      message: "Report submitted successfully. We'll review it within 24 hours.",
    })
  } catch (error) {
    process.env.NODE_ENV === "development" ? console.log(error) : ""
    return NextResponse.json({ error: "internal server error" }, { status: 500 })
  }
}
