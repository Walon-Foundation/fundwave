import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const location = searchParams.get("location")

  // Demo search results
  return NextResponse.json({
    campaigns: [
      {
        id: "1",
        title: "Clean Water Project",
        description: "Bringing clean water to rural communities",
        raised: 2500000,
        target: 5000000,
        category: "Community",
      },
    ],
    total: 1,
    query,
    filters: { category, location },
  })
}
