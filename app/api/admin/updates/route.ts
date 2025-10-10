import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { updateTable } from "@/db/schema";
import { eq, desc, count, and, ilike, or, type SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (!userId || (adminClerkId && userId !== adminClerkId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const search = url.searchParams.get("search") || "";
    const campaignId = url.searchParams.get("campaignId") || "";
    const offset = (page - 1) * limit;

    let whereCondition: SQL<unknown> | undefined;
    if (campaignId) whereCondition = eq(updateTable.campaignId, campaignId);
    if (search) whereCondition = whereCondition ? and(whereCondition, ilike(updateTable.title, `%${search}%`)) : ilike(updateTable.title, `%${search}%`);

    const items = await db.select().from(updateTable).where(whereCondition).orderBy(desc(updateTable.createdAt)).limit(limit).offset(offset);
    const [{ count: total }] = await db.select({ count: count() }).from(updateTable).where(whereCondition);

    return NextResponse.json({ ok: true, data: { items, pagination: { page, limit, total, totalPages: Math.ceil((total as number)/ limit) } } });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (!userId || (adminClerkId && userId !== adminClerkId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.delete(updateTable).where(eq(updateTable.id, id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}