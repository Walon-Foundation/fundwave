import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { logTable } from "@/db/schema";
import { and, between, desc, eq, ilike, gte, lte, sql, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const level = url.searchParams.get("level") || ""; // success|error|warning|info
    const category = url.searchParams.get("category") || "";
    const user = url.searchParams.get("user") || "";
    const search = url.searchParams.get("search") || "";
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const offset = (page - 1) * limit;

    const whereClauses: any[] = [];
    if (level) whereClauses.push(eq(logTable.level, level as any));
    if (category) whereClauses.push(ilike(logTable.category, `%${category}%`));
    if (user) whereClauses.push(ilike(logTable.user, `%${user}%`));
    if (search) whereClauses.push(ilike(logTable.details, `%${search}%`));
    if (from && to) whereClauses.push(between(logTable.timestamp, new Date(from), new Date(to)));
    else if (from) whereClauses.push(gte(logTable.timestamp, new Date(from)));
    else if (to) whereClauses.push(lte(logTable.timestamp, new Date(to)));

    const where = whereClauses.length ? and(...whereClauses) : undefined;

    const rows = await db
      .select()
      .from(logTable)
      .where(where as any)
      .orderBy(desc(logTable.timestamp))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(logTable)
      .where(where as any);

    return NextResponse.json({
      ok: true,
      data: {
        logs: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
