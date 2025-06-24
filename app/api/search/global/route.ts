import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "all"

  return NextResponse.json({
    results: {
      campaigns: [
        {
          id: "1",
          type: "campaign",
          title: "Clean Water Project",
          description: "Bringing clean water to rural communities",
          image: "/placeholder.svg?height=100&width=100",
          raised: 2500000,
          target: 5000000,
        },
      ],
      users: [
        {
          id: "user1",
          type: "user",
          name: "Aminata Kamara",
          avatar: "/placeholder.svg?height=40&width=40",
          verified: true,
          campaignsCreated: 2,
        },
      ],
      categories: [
        {
          id: "community",
          type: "category",
          name: "Community",
          campaignCount: 25,
        },
      ],
    },
    query,
    total: 3,
  })
}
