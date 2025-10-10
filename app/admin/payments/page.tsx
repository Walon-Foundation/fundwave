"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Donation {
  id: string;
  userId: string | null;
  username: string | null;
  email: string;
  amount: number;
  campaignId: string;
  monimeId: string;
  isCompleted: boolean;
  isBlocked?: boolean;
  createdAt: string;
}

interface Cashout {
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  monime_id: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<"donations" | "cashouts">("donations");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [donations, setDonations] = useState<Paginated<Donation> | null>(null);
  const [cashouts, setCashouts] = useState<Paginated<Cashout> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: String(page), limit: "20", search, status: statusFilter });
      const res = await fetch(`/api/admin/payments?type=${activeTab}&${query.toString()}`);
      const data = await res.json();
      if (data.ok) {
        if (activeTab === "donations") setDonations(data.data);
        else setCashouts(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, statusFilter]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-SL", { style: "currency", currency: "SLE", maximumFractionDigits: 0 }).format(amount);

  const blockDonation = async (id: string, block: boolean) => {
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "donation", id, action: block ? "block" : "unblock" }),
    });
    fetchData();
  };

  const markDonation = async (id: string, complete: boolean) => {
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "donation", id, action: "mark", status: complete }),
    });
    fetchData();
  };

  const updateCashout = async (id: string, status: string) => {
    await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "cashout", id, action: "status", status }),
    });
    fetchData();
  };

  const renderDonations = () => (
    <Card>
      <CardHeader>
        <CardTitle>Donations ({donations?.pagination.total || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input placeholder="Search by user, email or campaign id" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48 w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <div className="text-center text-neutral-500 py-6">Loading...</div>
        ) : donations && donations.items.length > 0 ? (
          <div className="space-y-3">
            {donations.items.map((d) => (
              <div key={d.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{formatCurrency(d.amount)}</div>
                    <div className="text-sm text-neutral-600">{d.email} • {d.username || d.userId || "Guest"}</div>
                    <div className="text-xs text-neutral-500">Campaign: {d.campaignId} • {new Date(d.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => markDonation(d.id, !d.isCompleted)}>
                      {d.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                    </Button>
                    <Button variant="outline" size="sm" className={d.isBlocked ? "text-green-600 border-green-200" : "text-red-600 border-red-200"} onClick={() => blockDonation(d.id, !d.isBlocked)}>
                      {d.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 py-6">No donations found</div>
        )}
      </CardContent>
    </Card>
  );

  const renderCashouts = () => (
    <Card>
      <CardHeader>
        <CardTitle>Cashouts ({cashouts?.pagination.total || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input placeholder="Search by user or campaign id" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48 w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <div className="text-center text-neutral-500 py-6">Loading...</div>
        ) : cashouts && cashouts.items.length > 0 ? (
          <div className="space-y-3">
            {cashouts.items.map((c) => (
              <div key={c.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{formatCurrency(c.amount)}</div>
                    <div className="text-sm text-neutral-600">User: {c.userId} • Campaign: {c.campaignId}</div>
                    <div className="text-xs text-neutral-500">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {(c.status === "pending" || c.status === "failed") && (
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200" onClick={() => updateCashout(c.id, "completed")}>Mark Completed</Button>
                    )}
                    {c.status !== "failed" && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => updateCashout(c.id, "failed")}>Mark Failed</Button>
                    )}
                    {c.status !== "pending" && (
                      <Button variant="outline" size="sm" onClick={() => updateCashout(c.id, "pending")}>Set Pending</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-500 py-6">No cashouts found</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payments</h2>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setPage(1); }}>
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="cashouts">Cashouts</TabsTrigger>
        </TabsList>
        <TabsContent value="donations">{renderDonations()}</TabsContent>
        <TabsContent value="cashouts">{renderCashouts()}</TabsContent>
      </Tabs>

      {/* Pagination */}
      {((activeTab === "donations" && donations?.pagination.totalPages) || (activeTab === "cashouts" && cashouts?.pagination.totalPages)) && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-neutral-600">Page {page} of {activeTab === "donations" ? donations?.pagination.totalPages : cashouts?.pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={(activeTab === "donations" ? donations!.pagination.page : cashouts!.pagination.page) >= (activeTab === "donations" ? donations!.pagination.totalPages : cashouts!.pagination.totalPages)} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
    </section>
  );
}
