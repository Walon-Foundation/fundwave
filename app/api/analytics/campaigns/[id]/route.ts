import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return NextResponse.json({
    campaignId: (await params).id,
    analytics: {
      views: {
        total: 1250,
        unique: 890,
        today: 45,
        trend: 12.5,
      },
      donations: {
        total: 45,
        amount: 2500000,
        average: 55555,
        trend: 8.7,
      },
      engagement: {
        shares: 89,
        comments: 12,
        likes: 156,
        saves: 34,
      },
      traffic: {
        direct: 35,
        social: 28,
        search: 22,
        referral: 15,
      },
      demographics: {
        ageGroups: [
          { range: "18-24", percentage: 25 },
          { range: "25-34", percentage: 35 },
          { range: "35-44", percentage: 22 },
          { range: "45+", percentage: 18 },
        ],
        locations: [
          { city: "Freetown", percentage: 45 },
          { city: "Bo", percentage: 20 },
          { city: "Kenema", percentage: 15 },
          { city: "Makeni", percentage: 20 },
        ],
      },
    },
  })
}
