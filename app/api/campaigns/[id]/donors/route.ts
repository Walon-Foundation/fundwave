import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  return NextResponse.json({
    donors: [
      {
        id: "donor1",
        name: "Aminata K.",
        avatar: "/placeholder.svg?height=40&width=40",
        amount: 100000,
        message: "Great cause! Keep up the good work.",
        anonymous: false,
        donatedAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "donor2",
        name: "Anonymous",
        avatar: null,
        amount: 50000,
        message: "",
        anonymous: true,
        donatedAt: "2024-01-19T14:15:00Z",
      },
      {
        id: "donor3",
        name: "Mohamed S.",
        avatar: "/placeholder.svg?height=40&width=40",
        amount: 75000,
        message: "Supporting this important initiative.",
        anonymous: false,
        donatedAt: "2024-01-18T09:45:00Z",
      },
    ],
    pagination: { page, limit, total: 45, pages: 5 },
    summary: {
      totalDonors: 45,
      totalAmount: 2500000,
      averageDonation: 55555,
      topDonation: 200000,
    },
  })
}
