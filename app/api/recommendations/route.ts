import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  return NextResponse.json({
    recommendations: [
      {
        id: "1",
        title: "Similar to your interests",
        campaigns: [
          {
            id: "rec1",
            title: "Education Project",
            reason: "Based on your previous donations",
          },
        ],
      },
    ],
  })
}
