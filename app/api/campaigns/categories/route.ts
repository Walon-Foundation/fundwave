import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    categories: [
      {
        id: "community",
        name: "Community",
        description: "Community development and infrastructure projects",
        icon: "users",
        campaignCount: 25,
        totalRaised: 15000000,
      },
      {
        id: "education",
        name: "Education",
        description: "Educational initiatives and school projects",
        icon: "graduation-cap",
        campaignCount: 18,
        totalRaised: 8500000,
      },
      {
        id: "healthcare",
        name: "Healthcare",
        description: "Medical treatments and healthcare facilities",
        icon: "heart",
        campaignCount: 15,
        totalRaised: 12000000,
      },
      {
        id: "environment",
        name: "Environment",
        description: "Environmental conservation and sustainability",
        icon: "leaf",
        campaignCount: 12,
        totalRaised: 6500000,
      },
      {
        id: "emergency",
        name: "Emergency",
        description: "Disaster relief and emergency assistance",
        icon: "alert-triangle",
        campaignCount: 8,
        totalRaised: 4200000,
      },
      {
        id: "sports",
        name: "Sports",
        description: "Sports development and athletic programs",
        icon: "trophy",
        campaignCount: 6,
        totalRaised: 2800000,
      },
    ],
  })
}
