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
    const pages = (row?.config as any)?.pages || {};
    return NextResponse.json({ ok: true, data: { pages } });
  } catch (e) {
    console.error("Admin pages GET error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT body: { pages: { [slug]: { title: string, content: string } } }
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const adminClerkId = process.env.ADMIN_CLERK_ID;
    if (adminClerkId && userId !== adminClerkId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const incomingPages = body?.pages || {};
    if (typeof incomingPages !== 'object') return NextResponse.json({ error: 'Invalid pages' }, { status: 400 });

    // Read existing config
    const [row] = await db.select().from(platformSettingsTable).where(eq(platformSettingsTable.id, DEFAULT_ID)).limit(1);
    const currentConfig: any = row?.config || {};
    const merged = {
      ...currentConfig,
      pages: {
        ...(currentConfig.pages || {}),
        ...incomingPages,
      }
    };

    const [updated] = await db
      .insert(platformSettingsTable)
      .values({ id: DEFAULT_ID, config: merged })
      .onConflictDoUpdate({ target: platformSettingsTable.id, set: { config: merged } })
      .returning();

    return NextResponse.json({ ok: true, data: { pages: (updated.config as any).pages } });
  } catch (e) {
    console.error("Admin pages PUT error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
