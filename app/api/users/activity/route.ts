import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  return NextResponse.json({
    activities: [
      {
        id: "activity1",
        type: "donation",
        description: "Donated Le 50,000 to Clean Water Project",
        amount: 50000,
        campaignId: "1",
        campaignTitle: "Clean Water Project",
        createdAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "activity2",
        type: "campaign_created",
        description: "Created new campaign: Youth Skills Training",
        campaignId: "2",
        campaignTitle: "Youth Skills Training",
        createdAt: "2024-01-19T14:15:00Z",
      },
      {
        id: "activity3",
        type: "comment",
        description: "Commented on Healthcare Initiative",
        campaignId: "3",
        campaignTitle: "Healthcare Initiative",
        createdAt: "2024-01-18T09:45:00Z",
      },
    ],
    pagination: { page, limit, total: 25, pages: 3 },
  })
}
