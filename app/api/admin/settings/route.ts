import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { platformSettingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_ID = "default";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [row] = await db.select().from(platformSettingsTable).where(eq(platformSettingsTable.id, DEFAULT_ID)).limit(1);
    if (!row) {
      await db.insert(platformSettingsTable).values({ id: DEFAULT_ID }).onConflictDoNothing();
      const [created] = await db.select().from(platformSettingsTable).where(eq(platformSettingsTable.id, DEFAULT_ID)).limit(1);
      return NextResponse.json({ ok: true, data: created });
    }

    return NextResponse.json({ ok: true, data: row });
  } catch (e) {
    console.error("Settings GET error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { config } = await request.json();
    if (!config || typeof config !== 'object') return NextResponse.json({ error: 'Invalid config' }, { status: 400 });

    const [updated] = await db
      .insert(platformSettingsTable)
      .values({ id: DEFAULT_ID, config })
      .onConflictDoUpdate({
        target: platformSettingsTable.id,
        set: { config },
      })
      .returning();

    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    console.error("Settings PUT error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
