import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    // Demo webhook processing
    console.log("Webhook received:", payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}
