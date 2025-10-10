import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { platformSettingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_ID = "default";

export async function GET() {
  try {
    const [row] = await db
      .select()
      .from(platformSettingsTable)
      .where(eq(platformSettingsTable.id, DEFAULT_ID))
      .limit(1);

    return NextResponse.json({ ok: true, data: row || { id: DEFAULT_ID, config: {} } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
