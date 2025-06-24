import { type NextRequest, NextResponse } from "next/server"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    userId: "user1",
    title: "New donation received",
    message: "John Doe donated $50 to your campaign 'Help Build School'",
    type: "donation",
    read: false,
    createdAt: "2024-12-24T10:30:00Z",
    data: {
      campaignId: "camp1",
      donorName: "John Doe",
      amount: 50,
    },
  },
  {
    id: "2",
    userId: "user1",
    title: "Campaign milestone reached",
    message: "Your campaign has reached 75% of its goal!",
    type: "milestone",
    read: false,
    createdAt: "2024-12-24T09:15:00Z",
    data: {
      campaignId: "camp1",
      percentage: 75,
    },
  },
  {
    id: "3",
    userId: "user1",
    title: "New comment on campaign",
    message: "Someone left a supportive comment on your campaign",
    type: "comment",
    read: true,
    createdAt: "2024-12-24T08:45:00Z",
    data: {
      campaignId: "camp1",
      commentId: "comment1",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let notifications = mockNotifications

    if (userId) {
      notifications = notifications.filter((n) => n.userId === userId)
    }

    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read)
    }

    notifications = notifications.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: {
        total: notifications.length,
        unreadCount: notifications.filter((n) => !n.read).length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, message, type, data } = body

    const newNotification = {
      id: Date.now().toString(),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      data: data || {},
    }

    mockNotifications.unshift(newNotification)

    return NextResponse.json({
      success: true,
      data: newNotification,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create notification",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, markAsRead } = body

    notificationIds.forEach((id: string) => {
      const notification = mockNotifications.find((n) => n.id === id)
      if (notification) {
        notification.read = markAsRead
      }
    })

    return NextResponse.json({
      success: true,
      message: `Notifications marked as ${markAsRead ? "read" : "unread"}`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update notifications",
      },
      { status: 500 },
    )
  }
}
