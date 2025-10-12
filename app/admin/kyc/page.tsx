"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  isKyc: boolean;
  status: "active" | "suspended" | "banned";
  createdAt: string;
}

export default function AdminKycPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycFilter, setKycFilter] = useState("pending"); // pending|verified|all

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "50", kyc: kycFilter });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.ok) setUsers(json.data.users);
    } finally {
      setLoading(false);
    }
  }, [kycFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const setUserKyc = async (userId: string, approve: boolean) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "kyc", userIdToUpdate: userId, approve }),
    });
    fetchUsers();
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">KYC Review</h2>
        <Select value={kycFilter} onValueChange={setKycFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <EmptyState title="No users found" description="No users match the selected KYC filter." />
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between border rounded-lg p-4 bg-white">
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-sm text-neutral-600">{u.email}</div>
                  </div>
                  <div className="flex gap-2">
                    {u.isKyc ? (
                      <Button variant="outline" className="text-yellow-600 border-yellow-200" onClick={() => setUserKyc(u.id, false)}>Revoke</Button>
                    ) : (
                      <Button variant="outline" className="text-blue-600 border-blue-200" onClick={() => setUserKyc(u.id, true)}>Approve</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}