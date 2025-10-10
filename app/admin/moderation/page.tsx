"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminModerationPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [c, u] = await Promise.all([
        fetch('/api/admin/comments').then(r=>r.json()),
        fetch('/api/admin/updates').then(r=>r.json()),
      ]);
      if (c.ok) setComments(c.data.items);
      if (u.ok) setUpdates(u.data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteComment = async (id: string) => {
    await fetch('/api/admin/comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const deleteUpdate = async (id: string) => {
    await fetch('/api/admin/updates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Content Moderation</h2>
      <Tabs defaultValue="comments">
        <TabsList>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="comments">
          <Card>
            <CardHeader><CardTitle>Comments ({comments.length})</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-72" />
                      </div>
                      <Skeleton className="h-9 w-24" />
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <EmptyState title="No comments found" description="There are no comments to moderate right now." />
              ) : (
                <div className="space-y-3">
                  {comments.map((c) => (
                    <div key={c.id} className="border rounded-lg p-4 bg-white flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{c.username}</div>
                        <div className="text-sm text-neutral-600">{c.message}</div>
                      </div>
                      <Button variant="outline" className="text-red-600 border-red-200" onClick={() => deleteComment(c.id)}>Delete</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates">
          <Card>
            <CardHeader><CardTitle>Updates ({updates.length})</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-72" />
                      </div>
                      <Skeleton className="h-9 w-24" />
                    </div>
                  ))}
                </div>
              ) : updates.length === 0 ? (
                <EmptyState title="No updates found" description="There are no updates to moderate right now." />
              ) : (
                <div className="space-y-3">
                  {updates.map((u) => (
                    <div key={u.id} className="border rounded-lg p-4 bg-white flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{u.title}</div>
                        <div className="text-sm text-neutral-600 line-clamp-2">{u.message}</div>
                      </div>
                      <Button variant="outline" className="text-red-600 border-red-200" onClick={() => deleteUpdate(u.id)}>Delete</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}