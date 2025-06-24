import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { donationId, reason } = await request.json()

    return NextResponse.json({
      success: true,
      refund: {
        id: `refund_${Date.now()}`,
        donationId,
        reason,
        status: "processing",
        estimatedDays: 3,
        createdAt: new Date().toISOString(),
      },
      message: "Refund request submitted. Processing time: 3-5 business days.",
    })
  } catch (error) {
    return NextResponse.json({ error: "Refund request failed" }, { status: 400 })
  }
}
