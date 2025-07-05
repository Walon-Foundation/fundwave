import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { chatMessageTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import cuid from "cuid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId");

  if (!campaignId) {
    return new NextResponse("Campaign ID is required", { status: 400 });
  }

  try {
    const messages = await db
      .select()
      .from(chatMessageTable)
      .where(eq(chatMessageTable.campaignId, campaignId));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { campaignId, userId, userName, message } = await request.json();

    if (!campaignId || !userId || !userName || !message) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newMessage = {
      id: cuid(),
      campaignId,
      userId,
      userName,
      message,
    };

    const [insertedMessage] = await db
      .insert(chatMessageTable)
      .values(newMessage)
      .returning();

    return NextResponse.json({
      success: true,
      message: insertedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

