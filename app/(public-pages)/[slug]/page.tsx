"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PublicStaticPage() {
  const params = useParams<{ slug: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!params?.slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/pages/${params.slug}`);
        const j = await res.json();
        if (j.ok) {
          setTitle(j.data.title || "");
          setContent(j.data.content || "");
        }
      } finally { setLoading(false); }
    };
    load();
  }, [params?.slug]);

  return (
    <section className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>{loading ? "Loading..." : (title || (params?.slug as string)?.replace(/-/g, " "))}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-neutral-500">Loading content...</div>
          ) : content ? (
            <article className="prose prose-neutral max-w-none whitespace-pre-wrap">{content}</article>
          ) : (
            <div className="text-neutral-500">No content available.</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
