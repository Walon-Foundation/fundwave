import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  try {
    const [user] = await db.select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      address: userTable.address,
      phone: userTable.phone,
      isKyc: userTable.isKyc,
      role: userTable.role,
      amountContributed: userTable.amountContributed,
      isVerified: userTable.isVerified,
      district: userTable.district,
      occupation: userTable.occupation,
      nationality: userTable.nationality,
      profilePicture: userTable.profilePicture,
      createdAt: userTable.createdAt,
      status: userTable.status,
    }).from(userTable).where(eq(userTable.id, id));

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // TODO: Add logic to calculate campaignsSupported, campaignsCreated, totalRaised
    const userProfile = {
      ...user,
      campaignsSupported: 0, // Placeholder
      campaignsCreated: 0,   // Placeholder
      totalRaised: 0,        // Placeholder
    };


    return NextResponse.json(userProfile);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authenticatedUserId = request.headers.get("x-user-id");
  const { id } = params;

  if (!id) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  if (authenticatedUserId !== id) {
    return new NextResponse("Forbidden: You can only update your own profile", { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, address, phone, district, occupation, profilePicture } = body;

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
      .where(eq(userTable.id, id))
      .returning({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        address: userTable.address,
        phone: userTable.phone,
        district: userTable.district,
        occupation: userTable.occupation,
        profilePicture: userTable.profilePicture,
        updatedAt: userTable.updatedAt,
      });

    if (!updatedUser) {
      return new NextResponse("User not found or failed to update", { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

