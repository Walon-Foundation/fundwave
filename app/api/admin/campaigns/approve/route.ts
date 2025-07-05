import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { campaignTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { campaignId } = await request.json();

    if (!campaignId) {
      return new NextResponse("Campaign ID is required", { status: 400 });
    }

    await db
      .update(campaignTable)
      .set({ status: "active" })
      .where(eq(campaignTable.id, campaignId));

    return NextResponse.json({
      success: true,
      message: "Campaign approved successfully",
    });
  } catch (error) {
    console.error("Error approving campaign:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

