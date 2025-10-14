import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { campaignTable, notificationTable, userTable } from "@/db/schema";
import { and, eq, inArray, or } from "drizzle-orm";

export async function POST(_req: NextRequest) {
  // Mark all as read for notifications tied to the current user's campaigns or directly to the user
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = (await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1).execute())[0];
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    const campaigns = await db
      .select({ id: campaignTable.id })
      .from(campaignTable)
      .where(and(eq(campaignTable.creatorId, user.id), eq(campaignTable.isDeleted, false)));
    const campaignIds = campaigns.map((c) => c.id);

    // Build conditions: unread AND (belongs to user's campaigns OR targeted to the user)
    const conds = [eq(notificationTable.userId, user.id) as any];
    if (campaignIds.length > 0) conds.push(inArray(notificationTable.campaignId, campaignIds) as any);
    const scope = conds.length === 1 ? conds[0] : or(...conds);

    const updated = await db
      .update(notificationTable)
      .set({ read: true })
      .where(and(eq(notificationTable.read, false as any), scope))
      .returning({ id: notificationTable.id });

    return NextResponse.json({ ok: true, data: { updatedCount: updated.length } });
  } catch (e) {
    console.error("notifications mark-all error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // Mark a single notification id as read (if belongs to user's campaigns or is targeted to the user)
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id } = body as { id?: string };
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const user = (await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1).execute())[0];
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    const campaigns = await db
      .select({ id: campaignTable.id })
      .from(campaignTable)
      .where(and(eq(campaignTable.creatorId, user.id), eq(campaignTable.isDeleted, false)));
    const campaignIds = campaigns.map((c) => c.id);

    const conds = [eq(notificationTable.userId, user.id) as any];
    if (campaignIds.length > 0) conds.push(inArray(notificationTable.campaignId, campaignIds) as any);
    const scope = conds.length === 1 ? conds[0] : or(...conds);

    const updated = await db
      .update(notificationTable)
      .set({ read: true })
      .where(and(eq(notificationTable.id, id), scope))
      .returning({ id: notificationTable.id });

    return NextResponse.json({ ok: true, data: { updated: updated.length > 0 } });
  } catch (e) {
    console.error("notifications mark-one error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
