import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const [updatedUser] = await db
      .update(userTable)
      .set({ status: "suspended" })
      .where(eq(userTable.id, userId))
      .returning();

    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User suspended successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

