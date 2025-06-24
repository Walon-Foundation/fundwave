import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    notifications: {
      email: true,
      sms: false,
      push: true,
      campaignUpdates: true,
      donationReceipts: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "public",
      showDonations: true,
      showCampaigns: true,
    },
    preferences: {
      language: "en",
      currency: "SLL",
      timezone: "Africa/Freetown",
    },
  })
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json()

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Settings update failed" }, { status: 400 })
  }
}
