import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    campaigns: [
      {
        id: "1",
        title: "Clean Water for Makeni",
        raised: 2500000,
        target: 5000000,
        featured: true,
        featuredAt: new Date().toISOString(),
      },
    ],
  })
}
