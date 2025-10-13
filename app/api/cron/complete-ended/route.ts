import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { campaignTable } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

// Cron endpoint to mark campaigns as completed when end date has passed
// Protect with CRON_SECRET; configure your scheduler to send header: x-cron-secret
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-cron-secret");
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const updated = await db
      .update(campaignTable)
      .set({ status: "completed" as any })
      .where(and(lt(campaignTable.campaignEndDate, now), eq(campaignTable.status, "active" as any)))
      .returning({ id: campaignTable.id });

    return NextResponse.json({ ok: true, data: { updatedCount: updated.length } });
  } catch (e) {
    console.error("cron complete-ended error", e);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
