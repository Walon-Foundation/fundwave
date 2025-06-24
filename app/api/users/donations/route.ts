import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  return NextResponse.json({
    donations: [
      {
        id: "donation1",
        campaignId: "1",
        campaignTitle: "Clean Water Project",
        amount: 50000,
        currency: "SLL",
        status: "completed",
        paymentMethod: "orange_money",
        transactionId: "TXN123456",
        createdAt: "2024-01-20T10:30:00Z",
        anonymous: false,
      },
      {
        id: "donation2",
        campaignId: "2",
        campaignTitle: "Youth Skills Training",
        amount: 25000,
        currency: "SLL",
        status: "completed",
        paymentMethod: "credit_card",
        transactionId: "TXN123457",
        createdAt: "2024-01-18T15:20:00Z",
        anonymous: true,
      },
    ],
    summary: {
      totalDonated: 75000,
      totalCampaigns: 2,
      averageDonation: 37500,
    },
  })
}
