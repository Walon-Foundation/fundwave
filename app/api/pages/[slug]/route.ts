import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { platformSettingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_ID = "default";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const [row] = await db
      .select()
      .from(platformSettingsTable)
      .where(eq(platformSettingsTable.id, DEFAULT_ID))
      .limit(1);

    const pages = (row?.config as any)?.pages || {};
    const rec = pages[(await params).slug];

    if (!rec) return NextResponse.json({ ok: true, data: { title: "", content: "" } });

    return NextResponse.json({ ok: true, data: rec });
  } catch (e) {
    console.error("Public page GET error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
