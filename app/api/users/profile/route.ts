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
    const [user] = await db.select().from(userTable).where(eq(userTable.id, userId));

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Omit password from the response
    const { password, ...userProfile } = user;

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const updates = await request.json();
    // Add specific fields that can be updated to prevent unwanted changes
    const { name, address, phone, district, occupation, profilePicture } = updates;

    const [updatedUser] = await db
      .update(userTable)
      .set({
        name,
        address,
        phone,
        district,
        occupation,
        profilePicture,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, userId))
      .returning();

    if (!updatedUser) {
      return new NextResponse("User not found or failed to update", { status: 404 });
    }

    const { password, ...userProfile } = updatedUser;

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: userProfile,
    });
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

