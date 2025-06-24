import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["campaignId", "amount", "donorId", "paymentMethod"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Process donation
    const donation = {
      id: Date.now().toString(),
      ...body,
      status: "completed",
      transactionId: `TXN${Date.now()}`,
      createdAt: new Date().toISOString(),
      fees: body.amount * 0.025, // 2.5% platform fee
    }

    // In a real app, process payment and save to database

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 })
  }
}
