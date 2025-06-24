import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  return NextResponse.json({
    campaigns: [
      {
        id: "1",
        title: "Clean Water Project",
        creator: "Aminata Kamara",
        status: status || "active",
        raised: 2500000,
        target: 5000000,
        createdAt: "2024-01-15",
      },
    ],
  })
}
