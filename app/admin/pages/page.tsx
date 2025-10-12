"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DEFAULT_SLUGS = [
  "privacy",
  "terms",
  "cookie-policy",
  "refund-policy",
  "community-guidelines",
  "contact",
  "help",
  "about",
  "careers",
  "success-stories",
  "blog",
  "pricing",
];

type PageRecord = { title: string; content: string };

type PagesState = Record<string, PageRecord>;

export default function AdminPagesManager() {
  const [pages, setPages] = useState<PagesState>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/admin/pages');
      const j = await res.json();
      if (j.ok) {
        setPages(j.data.pages || {});
      }
    };
    load();
  }, []);

  const allSlugs = useMemo(() => {
    const existing = Object.keys(pages || {});
    const union = new Set([...DEFAULT_SLUGS, ...existing]);
    return Array.from(union);
  }, [pages]);

  const update = (slug: string, key: keyof PageRecord, value: string) => {
    setPages(prev => ({ ...prev, [slug]: { title: prev[slug]?.title || '', content: prev[slug]?.content || '', [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const filtered: PagesState = {};
      for (const slug of Object.keys(pages)) {
        const rec = pages[slug];
        if (rec?.title || rec?.content) filtered[slug] = rec;
      }
      await fetch('/api/admin/pages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pages: filtered }) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pages</h2>
          <p className="text-neutral-600">Edit public content pages</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save All'}</Button>
      </div>

      <div className="grid gap-6">
        {allSlugs.map((slug) => {
          const rec = pages[slug] || { title: '', content: '' };
          return (
            <Card key={slug}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
                  <a href={`/${slug}`} target="_blank" className="text-sm text-blue-600 underline">View</a>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input value={rec.title} onChange={(e) => update(slug, 'title', e.target.value)} placeholder="Page title" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Content (Markdown or plain text)</Label>
                    <Textarea value={rec.content} onChange={(e) => update(slug, 'content', e.target.value)} rows={14} placeholder="Page content" />
                  </div>
                  <div>
                    <Label>Preview</Label>
                    <div className="mt-2 border rounded-md p-4 bg-white min-h-[200px]">
                      <article className="prose prose-neutral max-w-none whitespace-pre-wrap">
                        {rec.content || <span className="text-neutral-400">Nothing to preview</span>}
                      </article>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
