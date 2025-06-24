import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    stats: {
      totalUsers: 1250,
      newUsersToday: 15,
      totalCampaigns: 89,
      activeCampaigns: 34,
      pendingCampaigns: 8,
      totalRaised: 45000000,
      todaysDonations: 850000,
      platformFees: 1125000,
    },
    recentActivity: [
      {
        id: "activity1",
        type: "new_campaign",
        message: "New campaign created: Healthcare Initiative",
        timestamp: "2024-01-20T10:30:00Z",
      },
      {
        id: "activity2",
        type: "large_donation",
        message: "Large donation of Le 500,000 received",
        timestamp: "2024-01-20T09:15:00Z",
      },
      {
        id: "activity3",
        type: "user_signup",
        message: "5 new users registered today",
        timestamp: "2024-01-20T08:00:00Z",
      },
    ],
    alerts: [
      {
        id: "alert1",
        type: "warning",
        message: "3 campaigns pending approval for over 48 hours",
        priority: "medium",
      },
      {
        id: "alert2",
        type: "info",
        message: "Monthly platform fee collection due in 5 days",
        priority: "low",
      },
    ],
  })
}
