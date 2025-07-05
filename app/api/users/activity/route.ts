import { NextResponse } from "next/server";

import { db } from "@/db/drizzle";
import { logTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const activities = await db
      .select()
      .from(logTable)
      .where(eq(logTable.user, userId))
      .limit(limit)
      .offset(offset);

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(logTable)
      .where(eq(logTable.user, userId));

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total: total.count,
        pages: Math.ceil(total.count / limit),
      },
    });
  } catch (error) {
    console.error(`Error fetching activity for user ${userId}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

