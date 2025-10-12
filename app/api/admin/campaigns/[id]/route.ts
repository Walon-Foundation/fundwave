import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { campaignTable, commentTable, paymentTable, updateTable, userTable, withdrawalTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = (await params).id;
    const [campaign] = await db.select().from(campaignTable).where(eq(campaignTable.id, id)).limit(1);
    if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [creator] = await db.select().from(userTable).where(eq(userTable.id, campaign.creatorId)).limit(1);
    const payments = await db.select().from(paymentTable).where(eq(paymentTable.campaignId, id)).orderBy(desc(paymentTable.createdAt));
    const comments = await db.select().from(commentTable).where(eq(commentTable.campaignId, id)).orderBy(desc(commentTable.createdAt));
    const updates = await db.select().from(updateTable).where(eq(updateTable.campaignId, id)).orderBy(desc(updateTable.createdAt));
    const cashouts = await db.select().from(withdrawalTable).where(eq(withdrawalTable.campaignId, id)).orderBy(desc(withdrawalTable.createdAt));

    return NextResponse.json({
      ok: true,
      data: {
        campaign,
        creator: creator ? { ...creator, clerkId: undefined } : null,
        payments,
        donations: payments, // alias
        comments,
        updates,
        cashouts,
      },
    });
  } catch (e) {
    console.error("GET /api/admin/campaigns/[id] error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
