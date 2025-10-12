"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LogRow {
  id: string;
  level: "success" | "error" | "warning" | "info";
  timestamp: string;
  category: string;
  user: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      search,
      category,
      user,
    });
    if (level !== "all") params.set("level", level);

    try {
      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      if (data.ok) {
        setLogs(data.data.logs);
        setTotalPages(data.data.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, level]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Activity Logs</h2>
          <p className="text-neutral-600">System events across the platform</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input placeholder="Search details" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setPage(1); fetchLogs(); }}>Filter</Button>
              <Button variant="ghost" onClick={() => { setSearch(""); setCategory(""); setUser(""); setLevel("all"); setPage(1); fetchLogs(); }}>Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-neutral-500">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">No logs found</div>
          ) : (
            <div className="space-y-3">
              {logs.map((l) => (
                <div key={l.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        l.level === 'success' ? 'text-green-700 bg-green-50 border-green-200' :
                        l.level === 'info' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        l.level === 'warning' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                        'text-red-700 bg-red-50 border-red-200'
                      }`}>
                        {l.level}
                      </span>
                      <span className="text-sm font-medium">{l.category}</span>
                    </div>
                    <div className="text-xs text-neutral-500">{new Date(l.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-700 whitespace-pre-wrap">{l.details}</div>
                  <div className="mt-2 text-xs text-neutral-500">User: {l.user} • IP: {l.ipAddress}</div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm text-neutral-600">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
