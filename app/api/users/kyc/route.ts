import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const kycData = await request.json()

    return NextResponse.json({
      success: true,
      message: "KYC documents submitted for review",
      status: "pending",
      submittedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "KYC submission failed" }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "approved",
    submittedAt: "2024-01-15T00:00:00Z",
    approvedAt: "2024-01-16T00:00:00Z",
    documents: ["id_card", "proof_of_address"],
  })
}
