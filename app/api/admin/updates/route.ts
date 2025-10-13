import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { updateTable, campaignTable, userTable } from "@/db/schema";
import { eq, desc, count, and, ilike, or, type SQL } from "drizzle-orm";
import { sendEmail } from "@/lib/nodeMailer";
import { logEvent } from "@/lib/logging";
import { sendNotification } from "@/lib/notification";

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

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (!userId || (adminClerkId && userId !== adminClerkId)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id, action } = await request.json();
    if (!id || action !== 'restore') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    await db.update(updateTable).set({ isDeleted: false, updatedAt: new Date() }).where(eq(updateTable.id, id));
    return NextResponse.json({ ok: true });
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

    // Fetch update and campaign owner
    const [upd] = await db.select({ campaignId: updateTable.campaignId, title: updateTable.title }).from(updateTable).where(eq(updateTable.id, id)).limit(1);
    let creatorEmail: string | undefined; let creatorName: string | undefined; let campaignTitle: string | undefined;
    if (upd?.campaignId) {
      const [cam] = await db.select({ creatorId: campaignTable.creatorId, title: campaignTable.title }).from(campaignTable).where(eq(campaignTable.id, upd.campaignId)).limit(1);
      campaignTitle = cam?.title;
      if (cam?.creatorId) {
        const [u] = await db.select({ email: userTable.email, name: userTable.name }).from(userTable).where(eq(userTable.id, cam.creatorId)).limit(1);
        creatorEmail = u?.email; creatorName = u?.name;
      }
    }

await db.update(updateTable).set({ isDeleted: true, updatedAt: new Date() }).where(eq(updateTable.id, id));

    // Notify creator via email (best-effort)
    try {
      if (creatorEmail) {
        await sendEmail('update-deleted' as any, creatorEmail, 'An update was removed from your campaign', { name: creatorName || 'User', campaign: campaignTitle || '', update: upd?.title || '' } as any);
      }
    } catch {}

    // In-app notification
    try {
      if (upd?.campaignId && creatorEmail && creatorName) {
        const [cam] = await db.select({ creatorId: campaignTable.creatorId }).from(campaignTable).where(eq(campaignTable.id, upd.campaignId)).limit(1);
        if (cam?.creatorId) {
          await sendNotification('Update removed by admin', 'update' as any, cam.creatorId, upd.campaignId);
        }
      }
    } catch {}

    // Audit log
    try {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
      const ua = request.headers.get('user-agent') || '';
      await logEvent({ level: 'warning', category: 'admin:update:delete', user: userId, details: `Deleted update ${id}`, ipAddress: ip, userAgent: ua, metaData: { updateId: id, campaignId: upd?.campaignId } });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}