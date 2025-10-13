import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { commentTable, campaignTable, userTable } from "@/db/schema";
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
    if (campaignId) whereCondition = eq(commentTable.campaignId, campaignId);
    if (search) whereCondition = whereCondition ? and(whereCondition, ilike(commentTable.message, `%${search}%`)) : ilike(commentTable.message, `%${search}%`);

    const items = await db.select().from(commentTable).where(whereCondition).orderBy(desc(commentTable.createdAt)).limit(limit).offset(offset);
    const [{ count: total }] = await db.select({ count: count() }).from(commentTable).where(whereCondition);

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

    await db.update(commentTable).set({ isDeleted: false, updatedAt: new Date() }).where(eq(commentTable.id, id));
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

    // fetch comment owner and campaign info before deletion
    const [c] = await db.select({ userId: commentTable.userId, campaignId: commentTable.campaignId }).from(commentTable).where(eq(commentTable.id, id)).limit(1);
await db.update(commentTable).set({ isDeleted: true, updatedAt: new Date() }).where(eq(commentTable.id, id));

    // notify via email (best-effort)
    try {
      if (c?.userId) {
        const [u] = await db.select({ email: userTable.email, name: userTable.name }).from(userTable).where(eq(userTable.id, c.userId)).limit(1);
        let campaignTitle: string | undefined;
        if (c?.campaignId) {
          const [cam] = await db.select({ title: campaignTable.title }).from(campaignTable).where(eq(campaignTable.id, c.campaignId)).limit(1);
          campaignTitle = cam?.title;
        }
        if (u?.email) {
          await sendEmail('comment-deleted' as any, u.email, 'Your comment was removed', { name: u.name, campaign: campaignTitle || '' } as any);
        }
      }
    } catch {}

    // in-app notification (best-effort)
    try {
      if (c?.userId && c?.campaignId) {
        await sendNotification('Comment removed by admin', 'comment' as any, c.userId, c.campaignId);
      }
    } catch {}

    // audit log
    try {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
      const ua = request.headers.get('user-agent') || '';
      await logEvent({ level: 'warning', category: 'admin:comment:delete', user: userId, details: `Deleted comment ${id}`, ipAddress: ip, userAgent: ua, metaData: { commentId: id, campaignId: c?.campaignId, targetUserId: c?.userId } });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}