import { NextResponse } from "next/server"

// Mock campaigns data
const campaigns = [
  {
    id: "1",
    title: "Clean Water for Makeni Community",
    description:
      "Help us bring clean, safe drinking water to over 500 families in Makeni. Our community has been struggling with water scarcity for years.",
    creator: {
      id: "user1",
      name: "Aminata Kamara",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    category: "Community",
    image: "/placeholder.svg?height=400&width=600",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    target: 5000000,
    raised: 2500000,
    donors: 45,
    views: 1250,
    shares: 89,
    comments: 12,
    updates: 2,
    daysLeft: 45,
    status: "active",
    featured: true,
    location: "Makeni, Northern Province",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
    endDate: "2024-06-15T23:59:59Z",
    tags: ["water", "community", "health", "infrastructure"],
    story:
      "Our community in Makeni has been facing a severe water crisis for the past five years. The nearest clean water source is over 3 kilometers away, forcing women and children to make dangerous journeys daily. This project will install a solar-powered water pump and distribution system that will serve over 500 families directly.",
    impact: {
      beneficiaries: 500,
      description: "families will have access to clean water",
    },
    milestones: [
      { amount: 1000000, description: "Purchase water pump equipment", completed: true },
      { amount: 2500000, description: "Begin installation work", completed: true },
      { amount: 4000000, description: "Complete piping system", completed: false },
      { amount: 5000000, description: "Project completion and training", completed: false },
    ],
    risks: "Weather conditions may delay installation. We have contingency plans in place.",
    timeline: "3-4 months from full funding",
  },
  {
    id: "2",
    title: "Youth Skills Training Center",
    description: "Establishing a vocational training center to provide marketable skills to unemployed youth in Bo.",
    creator: {
      id: "user2",
      name: "Mohamed Sesay",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    category: "Education",
    image: "/placeholder.svg?height=400&width=600",
    images: ["/placeholder.svg?height=400&width=600"],
    target: 6000000,
    raised: 3100000,
    donors: 56,
    views: 890,
    shares: 45,
    comments: 8,
    updates: 3,
    daysLeft: 89,
    status: "active",
    featured: false,
    location: "Bo, Southern Province",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z",
    endDate: "2024-05-10T23:59:59Z",
    tags: ["education", "youth", "skills", "employment"],
    story:
      "With youth unemployment at over 60% in our region, we need to provide practical skills training. This center will offer courses in carpentry, tailoring, computer literacy, and small business management.",
    impact: {
      beneficiaries: 200,
      description: "young people will receive skills training annually",
    },
    milestones: [
      { amount: 1500000, description: "Secure training facility", completed: true },
      { amount: 3000000, description: "Purchase equipment and tools", completed: true },
      { amount: 4500000, description: "Hire qualified instructors", completed: false },
      { amount: 6000000, description: "Launch first training programs", completed: false },
    ],
    risks: "Instructor availability may affect timeline. We are actively recruiting.",
    timeline: "6 months from full funding",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const featured = searchParams.get("featured")
  const search = searchParams.get("search")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  let filteredCampaigns = [...campaigns]

  // Apply filters
  if (category && category !== "all") {
    filteredCampaigns = filteredCampaigns.filter(
      (campaign) => campaign.category.toLowerCase() === category.toLowerCase(),
    )
  }

  if (status) {
    filteredCampaigns = filteredCampaigns.filter((campaign) => campaign.status === status)
  }

  if (featured === "true") {
    filteredCampaigns = filteredCampaigns.filter((campaign) => campaign.featured)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredCampaigns = filteredCampaigns.filter(
      (campaign) =>
        campaign.title.toLowerCase().includes(searchLower) ||
        campaign.description.toLowerCase().includes(searchLower) ||
        campaign.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Apply pagination
  const paginatedCampaigns = filteredCampaigns.slice(offset, offset + limit)

  return NextResponse.json({
    campaigns: paginatedCampaigns,
    total: filteredCampaigns.length,
    hasMore: offset + limit < filteredCampaigns.length,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "target", "category", "creatorId"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new campaign
    const newCampaign = {
      id: Date.now().toString(),
      ...body,
      raised: 0,
      donors: 0,
      views: 0,
      shares: 0,
      comments: 0,
      updates: 0,
      status: "pending", // New campaigns need approval
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, save to database
    campaigns.push(newCampaign)

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
