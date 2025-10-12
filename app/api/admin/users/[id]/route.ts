import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { userTable, campaignTable, paymentTable, commentTable, updateTable, userDocumentTable } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = (await params).id;
    const [user] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const campaigns = await db.select().from(campaignTable).where(eq(campaignTable.creatorId, id)).orderBy(desc(campaignTable.createdAt));
    const payments = await db.select().from(paymentTable).where(eq(paymentTable.userId, id)).orderBy(desc(paymentTable.createdAt));
    const comments = await db.select().from(commentTable).where(eq(commentTable.userId, id)).orderBy(desc(commentTable.createdAt));

    // Updates authored by user's campaigns
    const campaignIds = campaigns.map(c => c.id);
    let updates: any[] = [];
    if (campaignIds.length) {
      updates = await db
        .select()
        .from(updateTable)
        .where(inArray(updateTable.campaignId, campaignIds))
        .orderBy(desc(updateTable.createdAt));
    }

    const documents = await db.select().from(userDocumentTable).where(eq(userDocumentTable.userId, id));

    return NextResponse.json({
      ok: true,
      data: {
        user: { ...user, clerkId: undefined },
        campaigns,
        payments,
        comments,
        updates,
        documents,
      }
    });
  } catch (e) {
    console.error("GET /api/admin/users/[id] error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
