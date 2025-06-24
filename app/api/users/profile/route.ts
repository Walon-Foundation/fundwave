import { NextResponse } from "next/server"

export async function GET() {
  // Demo user profile
  return NextResponse.json({
    id: "user1",
    firstName: "Aminata",
    lastName: "Kamara",
    email: "aminata@email.com",
    phone: "+232 76 123 456",
    avatar: "/placeholder.svg?height=100&width=100",
    kycStatus: "approved",
    totalDonated: 750000,
    campaignsCreated: 2,
  })
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json()

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: { ...updates, updatedAt: new Date().toISOString() },
    })
  } catch (error) {
    return NextResponse.json({ error: "Profile update failed" }, { status: 400 })
  }
}
