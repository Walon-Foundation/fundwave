import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({
    receipt: {
      id: params.id,
      donationId: "donation123",
      campaignTitle: "Clean Water Project",
      donorName: "Aminata Kamara",
      amount: 50000,
      currency: "SLL",
      paymentMethod: "Orange Money",
      transactionId: "TXN123456",
      donatedAt: "2024-01-20T10:30:00Z",
      receiptNumber: `RCP${Date.now()}`,
      platformFee: 1250,
      netAmount: 48750,
    },
  })
}
