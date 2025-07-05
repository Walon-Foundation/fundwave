import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [user] = await db
      .select({ settings: userTable.settings })
      .from(userTable)
      .where(eq(userTable.id, userId));

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user.settings);
  } catch (error) {
    console.error(`Error fetching settings for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const settings = await request.json();

    const [updatedUser] = await db
      .update(userTable)
      .set({ settings, updatedAt: new Date() })
      .where(eq(userTable.id, userId))
      .returning({ settings: userTable.settings });

    if (!updatedUser) {
      return new NextResponse("User not found or failed to update", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: updatedUser.settings,
    });
  } catch (error) {
    console.error(`Error updating settings for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

