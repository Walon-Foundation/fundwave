import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Mock user data
  const user = {
    id: params.id,
    firstName: "Aminata",
    lastName: "Kamara",
    email: "aminata@email.com",
    phone: "+232 76 123 456",
    location: "Freetown, Western Area",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2024-01-15",
    kycStatus: "approved",
    totalDonated: 750000,
    campaignsSupported: 12,
    campaignsCreated: 2,
    totalRaised: 7500000,
  }

  return NextResponse.json(user)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // In a real app, update user in database
    const updatedUser = {
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
