import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { count } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  try {
    const users = await db
      .select()
      .from(userTable)
      .limit(limit)
      .offset(offset);

    const [totalRes] = await db.select({ value: count() }).from(userTable);
    const total = totalRes.value;
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      users,
      pagination: { page, limit, total, pages },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

