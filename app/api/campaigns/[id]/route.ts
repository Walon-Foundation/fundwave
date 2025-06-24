import { NextResponse } from "next/server"

// This would typically come from a database
const campaigns = [
  {
    id: "1",
    title: "Clean Water for Makeni Community",
    description: "Help us bring clean, safe drinking water to over 500 families in Makeni.",
    creator: {
      id: "user1",
      name: "Aminata Kamara",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    category: "Community",
    image: "/placeholder.svg?height=400&width=600",
    target: 5000000,
    raised: 2500000,
    donors: 45,
    status: "active",
    // ... other fields
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const campaign = campaigns.find((c) => c.id === params.id)

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
  }

  return NextResponse.json(campaign)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const campaignIndex = campaigns.findIndex((c) => c.id === params.id)

    if (campaignIndex === -1) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    // Update campaign
    campaigns[campaignIndex] = {
      ...campaigns[campaignIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(campaigns[campaignIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const campaignIndex = campaigns.findIndex((c) => c.id === params.id)

  if (campaignIndex === -1) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
  }

  campaigns.splice(campaignIndex, 1)

  return NextResponse.json({ message: "Campaign deleted successfully" })
}
