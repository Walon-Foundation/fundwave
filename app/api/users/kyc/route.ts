import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userTable, userDocumentTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import { join } from "path";
import cuid from "cuid";

export async function POST(request: Request) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const documentNumber = formData.get("documentNumber") as string;

    if (!file || !documentType || !documentNumber) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = file.name.split(".").pop();
    const filename = `${cuid()}.${extension}`;
    const path = join(process.cwd(), "public/uploads/kyc", filename);

    await writeFile(path, buffer);

    await db.insert(userDocumentTable).values({
      id: cuid(),
      userId,
      documentType,
      documentNumber,
      documentPhoto: `/uploads/kyc/${filename}`,
    });

    // You might want to set a 'pending' status on the userTable
    // For now, we'll just confirm submission

    return NextResponse.json({
      success: true,
      message: "KYC documents submitted successfully",
    });
  } catch (error) {
    console.error(`KYC submission failed for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [user] = await db
      .select({ isKyc: userTable.isKyc })
      .from(userTable)
      .where(eq(userTable.id, userId));

    const documents = await db
      .select()
      .from(userDocumentTable)
      .where(eq(userDocumentTable.userId, userId));

    return NextResponse.json({
      status: user?.isKyc ? "approved" : "pending", // This could be more granular
      documents,
    });
  } catch (error) {
    console.error(`Error fetching KYC status for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

