import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Demo file upload
    return NextResponse.json({
      success: true,
      url: `/uploads/${file.name}`,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    return NextResponse.json({ error: "File upload failed" }, { status: 400 })
  }
}
