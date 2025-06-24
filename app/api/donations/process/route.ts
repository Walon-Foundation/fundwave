import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { campaignId, amount, paymentMethod, donorInfo } = await request.json()

    // Demo payment processing
    return NextResponse.json({
      success: true,
      donation: {
        id: `donation_${Date.now()}`,
        campaignId,
        amount,
        paymentMethod,
        status: "completed",
        transactionId: `TXN${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Payment processing failed" }, { status: 400 })
  }
}
