"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Hero {
  title: string;
  subtitle: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HowStep { icon?: string; title: string; description: string }

interface HomeConfig {
  hero: Hero;
  howItWorks: HowStep[];
  featuredCampaigns: { mode: "manual" | "tag" | "auto"; ids?: string[]; tag?: string };
  partners: { name: string; logoUrl: string; link?: string }[];
  testimonials: { quote: string; author: string; avatarUrl?: string }[];
  announcements?: { title: string; body?: string; linkText?: string; linkHref?: string }[];
}

export default function AdminHomepageManager() {
  const [home, setHome] = useState<HomeConfig>({
    hero: { title: "Empower Change in Sierra Leone", subtitle: "Join hundreds supporting meaningful causes.", image: "", ctaText: "Start a Campaign", ctaLink: "/create-campaign" },
    howItWorks: [
      { icon: "bolt", title: "Start your campaign", description: "Create a campaign in minutes with clear goals." },
      { icon: "users", title: "Share with community", description: "Get support from friends, family, and neighbors." },
      { icon: "heart", title: "Receive donations", description: "Secure local payments and instant updates." },
    ],
    featuredCampaigns: { mode: "auto" },
    partners: [],
    testimonials: [],
    announcements: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const j = await res.json();
        const cfg = j?.data?.config || {};
        const current = cfg?.home || {};
        setHome((prev) => ({
          ...prev,
          ...current,
          hero: {
            ...prev.hero,
            ...(current.hero || {}),
          },
          howItWorks: Array.isArray(current.howItWorks) ? current.howItWorks : prev.howItWorks,
          featuredCampaigns: current.featuredCampaigns || prev.featuredCampaigns,
          partners: Array.isArray(current.partners) ? current.partners : prev.partners,
          testimonials: Array.isArray(current.testimonials) ? current.testimonials : prev.testimonials,
          announcements: Array.isArray(current.announcements) ? current.announcements : prev.announcements,
        }));
      } catch {}
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      // fetch current config to merge non-home keys safely
      const resGet = await fetch("/api/admin/settings");
      const j = await resGet.json();
      const cfg = j?.data?.config || {};
      const merged = { ...cfg, home };
      await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config: merged }) });
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (k: keyof Hero, v: string) => setHome((prev) => ({ ...prev, hero: { ...prev.hero, [k]: v } }));
  const updateStep = (i: number, k: keyof HowStep, v: string) => setHome((prev) => ({ ...prev, howItWorks: prev.howItWorks.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  const addStep = () => setHome((prev) => ({ ...prev, howItWorks: [...prev.howItWorks, { icon: "star", title: "", description: "" }] }));
  const removeStep = (i: number) => setHome((prev) => ({ ...prev, howItWorks: prev.howItWorks.filter((_, idx) => idx !== i) }));

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Homepage</h2>
          <p className="text-neutral-600">Manage hero, steps and featured content</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
      </div>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Title</Label>
            <Input value={home.hero.title} onChange={(e) => updateHero("title", e.target.value)} />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={home.hero.subtitle} onChange={(e) => updateHero("subtitle", e.target.value)} />
          </div>
          <div>
            <Label>Image / Video URL</Label>
            <Input value={home.hero.image || ""} onChange={(e) => updateHero("image", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CTA Text</Label>
              <Input value={home.hero.ctaText || ""} onChange={(e) => updateHero("ctaText", e.target.value)} />
            </div>
            <div>
              <Label>CTA Link</Label>
              <Input value={home.hero.ctaLink || ""} onChange={(e) => updateHero("ctaLink", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {home.howItWorks.map((s, i) => (
            <div key={i} className="grid md:grid-cols-3 gap-3 border rounded-md p-3">
              <div>
                <Label>Icon</Label>
                <Input value={s.icon || ""} onChange={(e) => updateStep(i, "icon", e.target.value)} placeholder="bolt / users / heart" />
              </div>
              <div>
                <Label>Title</Label>
                <Input value={s.title} onChange={(e) => updateStep(i, "title", e.target.value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={s.description} onChange={(e) => updateStep(i, "description", e.target.value)} rows={2} />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="button" variant="outline" onClick={() => removeStep(i)}>Remove</Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addStep}>Add Step</Button>
        </CardContent>
      </Card>

      {/* Featured campaigns (simple controls) */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <Label>Mode (auto | tag | manual)</Label>
              <Input value={home.featuredCampaigns.mode} onChange={(e) => setHome((p) => ({ ...p, featuredCampaigns: { ...p.featuredCampaigns, mode: e.target.value as any } }))} />
            </div>
            {home.featuredCampaigns.mode === "tag" && (
              <div>
                <Label>Tag</Label>
                <Input value={home.featuredCampaigns.tag || ""} onChange={(e) => setHome((p) => ({ ...p, featuredCampaigns: { ...p.featuredCampaigns, tag: e.target.value } }))} />
              </div>
            )}
            {home.featuredCampaigns.mode === "manual" && (
              <div className="md:col-span-2">
                <Label>Campaign IDs (comma-separated)</Label>
                <Input
                  placeholder="id1,id2,id3"
                  value={(home.featuredCampaigns.ids || []).join(",")}
                  onChange={(e) => setHome((p) => ({ ...p, featuredCampaigns: { ...p.featuredCampaigns, ids: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } }))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
