import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import cuid from "cuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split(".").pop();
    const filename = `${cuid()}.${extension}`;
    const path = join(process.cwd(), "public/uploads", filename);

    await writeFile(path, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("File upload failed:", error);
    return new NextResponse("File upload failed", { status: 500 });
  }
}

