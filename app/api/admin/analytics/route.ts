import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    overview: {
      totalUsers: 1250,
      totalCampaigns: 89,
      totalRaised: 45000000,
      activeCampaigns: 34,
    },
    trends: {
      userGrowth: 15.2,
      campaignGrowth: 8.7,
      donationGrowth: 23.1,
    },
    topCategories: [
      { name: "Community", count: 25, percentage: 28.1 },
      { name: "Education", count: 18, percentage: 20.2 },
      { name: "Healthcare", count: 15, percentage: 16.9 },
    ],
  })
}
