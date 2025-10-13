import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { campaignTable, notificationTable, userTable } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function POST(_req: NextRequest) {
  // Mark all as read for notifications tied to the current user's campaigns
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = (await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1).execute())[0];
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    const campaigns = await db.select({ id: campaignTable.id }).from(campaignTable).where(eq(campaignTable.creatorId, user.id));
    const campaignIds = campaigns.map(c => c.id);
    if (campaignIds.length === 0) return NextResponse.json({ ok: true, data: { updatedCount: 0 } });

    const updated = await db
      .update(notificationTable)
      .set({ read: true })
      .where(inArray(notificationTable.campaignId, campaignIds))
      .returning({ id: notificationTable.id });

    return NextResponse.json({ ok: true, data: { updatedCount: updated.length } });
  } catch (e) {
    console.error("notifications mark-all error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // Mark a single notification id as read (if belongs to user's campaigns)
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id } = body as { id?: string };
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const user = (await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.clerkId, clerkId)).limit(1).execute())[0];
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    const campaigns = await db.select({ id: campaignTable.id }).from(campaignTable).where(eq(campaignTable.creatorId, user.id));
    const campaignIds = campaigns.map(c => c.id);
    if (campaignIds.length === 0) return NextResponse.json({ ok: true, data: { updated: false } });

    const updated = await db
      .update(notificationTable)
      .set({ read: true })
      .where(and(eq(notificationTable.id, id), inArray(notificationTable.campaignId, campaignIds)))
      .returning({ id: notificationTable.id });

    return NextResponse.json({ ok: true, data: { updated: updated.length > 0 } });
  } catch (e) {
    console.error("notifications mark-one error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
