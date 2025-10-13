import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { campaignTable } from "@/db/schema";
import { and, lt, ne } from "drizzle-orm";

export async function POST(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const now = new Date();
    const updated = await db
      .update(campaignTable)
      .set({ status: 'completed' as any })
      .where(and(
        lt(campaignTable.campaignEndDate, now),
        ne(campaignTable.status, 'completed' as any)
      ))
      .returning({ id: campaignTable.id });

    return NextResponse.json({ ok: true, data: { updatedCount: updated.length, ids: updated.map(r => r.id) } });
  } catch (e) {
    console.error("admin job complete-ended-campaigns error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
