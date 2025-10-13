"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";

interface Campaign { id: string; title: string; image: string; status: string; amountReceived: number; fundingGoal: number; createdAt: string; category: string; location: string; campaignEndDate: string; creatorId: string; creatorName: string; shortDescription: string; isDeleted: boolean; }
interface Payment { id: string; amount: number; email: string; createdAt: string; userId: string | null; }
interface Comment { id: string; message: string; username: string; createdAt: string; }
interface Update { id: string; title: string; message: string; createdAt: string; }
interface Cashout { id: string; amount: number; status: string; createdAt: string; }

export default function AdminCampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/campaigns/${params.id}`);
        const j = await res.json();
        if (j.ok) setData(j.data);
      } finally { setLoading(false); }
    };
    load();
  }, [params?.id]);

  const reload = async () => {
    if (!params?.id) return;
    const res = await fetch(`/api/admin/campaigns/${params.id}`);
    const j = await res.json();
    if (j.ok) setData(j.data);
  };

  const restoreCampaign = async () => {
    if (!params?.id) return;
    setMutating(true);
    try {
      const r = await fetch('/api/admin/campaigns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignIdToUpdate: params.id, action: 'restore' }) });
      if (r.ok) await reload();
    } finally { setMutating(false); }
  };

  const deleteCampaign = async () => {
    if (!params?.id) return;
    if (!confirm('Delete this campaign? This can be undone by recovery.')) return;
    setMutating(true);
    try {
      const r = await fetch('/api/admin/campaigns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campaignIdToUpdate: params.id, action: 'delete' }) });
      if (r.ok) await reload();
    } finally { setMutating(false); }
  };

  const fmtCurrency = (n: number) => new Intl.NumberFormat('en-SL', { style: 'currency', currency: 'SLE', maximumFractionDigits: 0 }).format(n || 0);
  const progress = (received: number, goal: number) => Math.min(Math.round((received / Math.max(goal, 1)) * 100), 100);

  if (loading) return <div className="p-6 text-neutral-500">Loading campaign...</div>;
  if (!data) return <div className="p-6 text-neutral-500">Campaign not found</div>;

  const c: Campaign = data.campaign;

  return (
    <section className="space-y-6">
      <nav className="text-sm text-neutral-600">
        <Link href="/admin" className="hover:underline">Admin</Link>
        <span className="mx-1">/</span>
        <Link href="/admin/campaigns" className="hover:underline">Campaigns</Link>
        <span className="mx-1">/</span>
        <span className="text-neutral-900">{c.title}</span>
      </nav>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {c.title}
            {c.isDeleted && (<span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Deleted</span>)}
          </h2>
          <p className="text-neutral-600">Creator: {data.creator?.name || c.creatorName} • Status: <span className="capitalize">{c.status}</span></p>
        </div>
        <div className="flex items-center gap-3">
          {c.isDeleted ? (
            <button className="text-sm text-neutral-400 cursor-not-allowed" disabled>View public page</button>
          ) : (
            <Link href={`/campaigns/${c.id}`} className="text-sm text-blue-600 underline">View public page</Link>
          )}
          {c.isDeleted ? (
            <button onClick={restoreCampaign} disabled={mutating} className="text-sm px-3 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50">Recover</button>
          ) : (
            <button onClick={deleteCampaign} disabled={mutating} className="text-sm px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50">Delete</button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="cashouts">Cashouts</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="creator">Creator</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative w-full h-64">
                    <Image src={c.image} alt={c.title} fill className="object-cover rounded" />
                  </div>
                  <p className="mt-3 text-sm text-neutral-700">{c.shortDescription}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="text-neutral-600">Goal:</span> <span className="font-medium">{fmtCurrency(c.fundingGoal)}</span></div>
                  <div><span className="text-neutral-600">Received:</span> <span className="font-medium">{fmtCurrency(c.amountReceived)} ({progress(c.amountReceived, c.fundingGoal)}%)</span></div>
                  <div><span className="text-neutral-600">Category:</span> <span className="font-medium">{c.category}</span></div>
                  <div><span className="text-neutral-600">Location:</span> <span className="font-medium">{c.location}</span></div>
                  <div><span className="text-neutral-600">Created:</span> <span className="font-medium">{new Date(c.createdAt).toLocaleString()}</span></div>
                  <div><span className="text-neutral-600">Ends:</span> <span className="font-medium">{new Date(c.campaignEndDate).toLocaleDateString()}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                {data.payments?.length ? data.payments.map((p: Payment) => (
                  <div key={p.id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{fmtCurrency(p.amount)}</div>
                      <div className="text-xs text-neutral-600">{p.email}</div>
                    </div>
                    <div className="text-xs text-neutral-500">{new Date(p.createdAt).toLocaleString()}</div>
                  </div>
                )) : <div className="text-neutral-500">No payments</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashouts">
          <Card>
            <CardHeader><CardTitle>Cashouts</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                {data.cashouts?.length ? data.cashouts.map((w: Cashout) => (
                  <div key={w.id} className="border rounded p-3 flex items-center justify-between">
                    <div className="font-medium">{fmtCurrency(w.amount)}</div>
                    <div className="text-xs text-neutral-600 capitalize">{w.status}</div>
                    <div className="text-xs text-neutral-500">{new Date(w.createdAt).toLocaleString()}</div>
                  </div>
                )) : <div className="text-neutral-500">No cashouts</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations">
          <Card>
            <CardHeader><CardTitle>Donations</CardTitle></CardHeader>
            <CardContent>
              {/* Alias to payments for now */}
              <div className="text-sm text-neutral-500">Same as payments.</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                {data.comments?.length ? data.comments.map((cmt: Comment) => (
                  <div key={cmt.id} className="border rounded p-3">
                    <div className="text-neutral-800">{cmt.message}</div>
                    <div className="text-xs text-neutral-500 mt-1 flex justify-between">
                      <span>By {cmt.username}</span>
                      <span>{new Date(cmt.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                )) : <div className="text-neutral-500">No comments</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates">
          <Card>
            <CardHeader><CardTitle>Updates</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                {data.updates?.length ? data.updates.map((u: Update) => (
                  <div key={u.id} className="border rounded p-3">
                    <div className="font-medium">{u.title}</div>
                    <div className="text-xs text-neutral-500">{new Date(u.createdAt).toLocaleString()}</div>
                  </div>
                )) : <div className="text-neutral-500">No updates</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creator">
          <Card>
            <CardHeader><CardTitle>Creator</CardTitle></CardHeader>
            <CardContent>
              {data.creator ? (
                <div className="text-sm space-y-1">
                  <div>Name: <span className="font-medium">{data.creator.name}</span></div>
                  <div>Email: <span className="font-medium">{data.creator.email}</span></div>
                  <div>Status: <span className="font-medium capitalize">{data.creator.status}</span></div>
                  <Link href={`/admin/users/${data.creator.id}`} className="text-blue-600 underline text-xs">View user</Link>
                </div>
              ) : (
                <div className="text-neutral-500">No creator found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader><CardTitle>Images</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="relative w-full h-64">
                  <Image src={c.image} alt={c.title} fill className="object-cover rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
