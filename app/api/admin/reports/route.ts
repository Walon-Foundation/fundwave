import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "all"
  const type = searchParams.get("type") || "all"

  return NextResponse.json({
    reports: [
      {
        id: "report1",
        type: "campaign",
        targetId: "campaign123",
        targetTitle: "Suspicious Campaign",
        reason: "fraud",
        description: "This campaign seems fraudulent",
        reporterId: "user456",
        reporterName: "John Doe",
        status: "pending",
        priority: "high",
        createdAt: "2024-01-20T10:30:00Z",
      },
      {
        id: "report2",
        type: "user",
        targetId: "user789",
        targetTitle: "Spam User",
        reason: "spam",
        description: "User posting spam comments",
        reporterId: "user123",
        reporterName: "Jane Smith",
        status: "investigating",
        priority: "medium",
        createdAt: "2024-01-19T14:15:00Z",
      },
    ],
    summary: {
      total: 15,
      pending: 8,
      investigating: 4,
      resolved: 3,
    },
  })
}
