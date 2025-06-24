import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  return NextResponse.json({
    users: [
      {
        id: "user1",
        name: "Aminata Kamara",
        email: "aminata@email.com",
        kycStatus: "approved",
        totalDonated: 750000,
        campaignsCreated: 2,
        joinDate: "2024-01-15",
      },
    ],
    pagination: { page, limit, total: 1, pages: 1 },
  })
}
