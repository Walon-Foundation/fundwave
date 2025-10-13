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
      hero: cfg?.home?.hero || {
        title: "Empower Change in Sierra Leone",
        subtitle: "Join hundreds supporting meaningful causes.",
        image: "/hero.jpg",
        ctaText: "Start a Campaign",
        ctaLink: "/create-campaign",
      },
      theme: cfg?.theme || {
        primaryColor: "#006C67",
        accentColor: "#F9A826",
        mode: "light",
      },
      footer: cfg?.footer || {
        contactEmail: "info@fundwavesl.org",
        socialLinks: {
          facebook: "",
          twitter: "",
          instagram: "",
        },
      },
      seo: cfg?.seo || {
        metaTitle: "FundWaveSL",
        metaDescription: "Crowdfunding for Sierra Leone",
        keywords: ["fundraising", "Sierra Leone", "crowdfunding"],
      },
    };

    return NextResponse.json({ ok: true, data: payload });
  } catch (e) {
    console.error("site-settings GET error", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
