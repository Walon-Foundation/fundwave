import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { platformSettingsTable, campaignTable } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";

const DEFAULT_ID = "default";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "6"), 1), 24);

    const [row] = await db
      .select({ config: platformSettingsTable.config })
      .from(platformSettingsTable)
      .where(eq(platformSettingsTable.id, DEFAULT_ID))
      .limit(1);

    const cfg: any = row?.config || {};
    const feat: any = cfg?.home?.featuredCampaigns || { mode: "auto" };

    // Helper: ensure ended campaigns are marked completed
    const completeIfEnded = async (rows: any[]) => {
      const now = new Date()
      const endedIds = rows
        .filter((c: any) => c?.campaignEndDate && new Date(c.campaignEndDate) < now && c.status === 'active')
        .map((c: any) => c.id)
      if (endedIds.length) {
        await Promise.all(
          endedIds.map((id: string) =>
            db.update(campaignTable).set({ status: 'completed' as any }).where(eq(campaignTable.id, id))
          )
        )
        // Reflect new status in response
        rows = rows.map((c: any) => (endedIds.includes(c.id) ? { ...c, status: 'completed' } : c))
      }
      return rows
    }

    // Mode: manual (IDs explicitly given)
    if (feat.mode === "manual" && Array.isArray(feat.ids) && feat.ids.length) {
      let items = await db
        .select()
        .from(campaignTable)
        .where(inArray(campaignTable.id, feat.ids))
        .limit(limit);
      items = await completeIfEnded(items)
      // preserve manual order
      const order = new Map(feat.ids.map((id: string, i: number) => [id, i]));
      const sorted = items.sort((a, b) => {
        const ai = Number(order.get(a.id) ?? 0);
        const bi = Number(order.get(b.id) ?? 0);
        return ai - bi;
      });
      return NextResponse.json({ ok: true, data: sorted.slice(0, limit) });
    }

    // Mode: tag (filter by a tag)
    if (feat.mode === "tag" && typeof feat.tag === "string" && feat.tag.trim()) {
      // Simple approach: fetch recent campaigns and filter by tag in app layer
      let recent = await db.select().from(campaignTable).orderBy(desc(campaignTable.createdAt)).limit(100);
      recent = await completeIfEnded(recent)
      const tag = String(feat.tag).toLowerCase();
      const filtered = recent.filter((c: any) => Array.isArray(c.tags) && c.tags.some((t: string) => String(t).toLowerCase() === tag));
      return NextResponse.json({ ok: true, data: filtered.slice(0, limit) });
    }

    // Default: auto (recent active campaigns)
    let items = await db
      .select()
      .from(campaignTable)
      .orderBy(desc(campaignTable.createdAt))
      .limit(limit);
    items = await completeIfEnded(items)
    return NextResponse.json({ ok: true, data: items });
  } catch (e) {
    console.error("featured-campaigns GET error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
