import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { campaignTable, userTable } from "@/db/schema";
import { or, ilike } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "all";

  if (!query) {
    return new NextResponse("Query parameter is required", { status: 400 });
  }

  try {
    let campaigns: any[] = [];
    let users: any[] = [];

    if (type === "all" || type === "campaigns") {
      campaigns = await db
        .select()
        .from(campaignTable)
        .where(
          or(
            ilike(campaignTable.title, `%${query}%`),
            ilike(campaignTable.shortDescription, `%${query}%`),
            ilike(campaignTable.category, `%${query}%`)
          )
        );
    }

    if (type === "all" || type === "users") {
      users = await db
        .select()
        .from(userTable)
        .where(or(ilike(userTable.name, `%${query}%`), ilike(userTable.email, `%${query}%`)));
    }

    return NextResponse.json({
      results: {
        campaigns,
        users,
        categories: [], // Category search can be a future enhancement
      },
      query,
      total: campaigns.length + users.length,
    });
  } catch (error) {
    console.error("Error performing global search:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

