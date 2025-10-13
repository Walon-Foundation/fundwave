import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { platformSettingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_ID = "default";

export async function GET() {
  try {
    const [row] = await db
      .select({ config: platformSettingsTable.config })
      .from(platformSettingsTable)
      .where(eq(platformSettingsTable.id, DEFAULT_ID))
      .limit(1);

    const cfg: any = row?.config || {};

    const payload = {
      hero: cfg?.home?.hero || null,
      howItWorks: Array.isArray(cfg?.home?.howItWorks) ? cfg.home.howItWorks : [
        { icon: "bolt", title: "Start your campaign", description: "Create a campaign in minutes with clear goals." },
        { icon: "users", title: "Share with community", description: "Get support from friends, family, and neighbors." },
        { icon: "heart", title: "Receive donations", description: "Secure local payments and instant updates." },
      ],
      partners: Array.isArray(cfg?.home?.partners) ? cfg.home.partners : [],
      testimonials: Array.isArray(cfg?.home?.testimonials) ? cfg.home.testimonials : [],
      featured: cfg?.home?.featuredCampaigns || { mode: "auto" },
      announcements: Array.isArray(cfg?.home?.announcements) ? cfg.home.announcements : [],
    };

    return NextResponse.json({ ok: true, data: payload });
  } catch (e) {
    console.error("home-sections GET error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
