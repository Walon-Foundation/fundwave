"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface UserDoc { id: string; documentType: string; documentNumber: string; documentPhoto: string; }
interface Campaign { id: string; title: string; image: string; status: string; amountReceived: number; fundingGoal: number; createdAt: string; }
interface Payment { id: string; amount: number; campaignId: string; createdAt: string; email: string; }
interface Comment { id: string; message: string; campaignId: string; createdAt: string; }
interface Update { id: string; title: string; campaignId: string; createdAt: string; }

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  const user = data?.user;

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${params.id}`);
        const j = await res.json();
        if (j.ok) setData(j.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params?.id]);

  const progress = (received: number, goal: number) => Math.min(Math.round((received / Math.max(goal, 1)) * 100), 100);

  if (loading) return <div className="p-6 text-neutral-500">Loading user...</div>;
  if (!data) return <div className="p-6 text-neutral-500">User not found</div>;

  return (
    <section className="space-y-6">
      <nav className="text-sm text-neutral-600">
        <Link href="/admin" className="hover:underline">Admin</Link>
        <span className="mx-1">/</span>
        <Link href="/admin/users" className="hover:underline">Users</Link>
        <span className="mx-1">/</span>
        <span className="text-neutral-900">{user?.name || "User"}</span>
      </nav>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-neutral-600">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          {user?.isKyc ? (
            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">KYC Verified</span>
          ) : (
            <span className="text-xs px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">KYC Pending</span>
          )}
          <span className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-700 border border-gray-200 capitalize">{user?.status}</span>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div>Name: <span className="font-medium">{user?.name}</span></div>
                  <div>Email: <span className="font-medium">{user?.email}</span></div>
                  {user?.phone && <div>Phone: <span className="font-medium">{user.phone}</span></div>}
                  {user?.district && <div>District: <span className="font-medium">{user.district}</span></div>}
                  {user?.occupation && <div>Occupation: <span className="font-medium">{user.occupation}</span></div>}
                </div>
                <div>
                  <div>Joined: {new Date(user?.createdAt).toLocaleString()}</div>
                  <div>Updated: {new Date(user?.updatedAt).toLocaleString()}</div>
                  <div>Contributed: {new Intl.NumberFormat('en-SL', { style: 'currency', currency: 'SLE', maximumFractionDigits: 0 }).format(user?.amountContributed || 0)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader><CardTitle>Campaigns</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {data.campaigns?.length ? data.campaigns.map((c: Campaign) => (
                  <div key={c.id} className="border rounded-lg p-4">
                    <div className="flex gap-3 items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <Image src={c.image} alt={c.title} width={56} height={56} className="rounded object-cover w-14 h-14" />
                        <div>
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-neutral-600">Created {new Date(c.createdAt).toLocaleDateString()} • <span className="capitalize">{c.status}</span></div>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-700">
                        {progress(c.amountReceived, c.fundingGoal)}%
                      </div>
                    </div>
                  </div>
                )) : <div className="text-neutral-500">No campaigns</div>}
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
                      <div className="font-medium">{new Intl.NumberFormat('en-SL', { style: 'currency', currency: 'SLE', maximumFractionDigits: 0 }).format(p.amount)}</div>
                      <div className="text-xs text-neutral-600">Campaign: {p.campaignId}</div>
                    </div>
                    <div className="text-xs text-neutral-500">{new Date(p.createdAt).toLocaleString()}</div>
                  </div>
                )) : <div className="text-neutral-500">No payments</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                {data.comments?.length ? data.comments.map((c: Comment) => (
                  <div key={c.id} className="border rounded p-3">
                    <div className="text-neutral-800">{c.message}</div>
                    <div className="text-xs text-neutral-500 mt-1 flex justify-between">
                      <span>Campaign: {c.campaignId}</span>
                      <span>{new Date(c.createdAt).toLocaleString()}</span>
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
                  <div key={u.id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{u.title}</div>
                      <div className="text-xs text-neutral-600">Campaign: {u.campaignId}</div>
                    </div>
                    <div className="text-xs text-neutral-500">{new Date(u.createdAt).toLocaleString()}</div>
                  </div>
                )) : <div className="text-neutral-500">No updates</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {data.documents?.length ? data.documents.map((d: UserDoc) => (
                  <div key={d.id} className="border rounded-lg p-4">
                    <div className="text-sm font-medium">{d.documentType}</div>
                    <div className="text-xs text-neutral-600 mb-3">{d.documentNumber}</div>
                    <div className="relative w-full h-52 bg-neutral-100 rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d.documentPhoto} alt={d.documentType} className="object-contain w-full h-full rounded" />
                    </div>
                  </div>
                )) : <div className="text-neutral-500">No documents</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader><CardTitle>KYC</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm space-y-3">
                <div>Status: {user?.isKyc ? <span className="text-green-700">Verified</span> : <span className="text-yellow-700">Pending</span>}</div>
                <div className="flex gap-2">
                  {user?.isKyc ? (
                    <Button variant="outline" className="text-yellow-700 border-yellow-300" onClick={async () => {
                      await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'kyc', userIdToUpdate: user.id, approve: false }) });
                      router.refresh();
                    }}>Revoke KYC</Button>
                  ) : (
                    <Button variant="outline" className="text-blue-700 border-blue-300" onClick={async () => {
                      await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'kyc', userIdToUpdate: user.id, approve: true }) });
                      router.refresh();
                    }}>Approve KYC</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
