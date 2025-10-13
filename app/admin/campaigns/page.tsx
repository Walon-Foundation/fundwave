"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Eye, CheckCircle2, XCircle, Trash2, Clock4, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Toaster, toast } from "sonner";

interface Campaign {
  id: string;
  title: string;
  fundingGoal: number;
  amountReceived: number;
  location: string;
  campaignEndDate: string;
  creatorId: string;
  creatorName: string;
  category: string;
  image: string;
  shortDescription: string;
  campaignType: "business" | "project" | "personal" | "community";
  status: "pending" | "active" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface CampaignsResponse {
  campaigns: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [createdFrom, setCreatedFrom] = useState<string>("");
  const [createdTo, setCreatedTo] = useState<string>("");
  const [endingSoonOnly, setEndingSoonOnly] = useState(false);
  const [minProgress, setMinProgress] = useState<number>(0);
  const [sortKey, setSortKey] = useState<"createdAt"|"endDate"|"raised"|"progress">("createdAt");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<CampaignsResponse['pagination'] | null>(null);
  const [runningJob, setRunningJob] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search,
        status: statusFilter,
      });
      
      const response = await fetch(`/api/admin/campaigns?${params}`);
      const data = await response.json();
      
      if (data.ok) {
        setCampaigns(data.data.campaigns);
        setPagination(data.data.pagination);
        setSelected({});
        // hydrate notes map
        const nm: Record<string, string> = {};
        (data.data.campaigns || []).forEach((c: any) => { if (c.moderationNotes) nm[c.id] = c.moderationNotes; })
        setNotes(nm)
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignStatus = async (campaignId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignIdToUpdate: campaignId,
          status: newStatus,
        }),
      });
      
      const data = await response.json();
      if (data.ok) {
        toast.success("Status updated");
        fetchCampaigns(); // Refresh the list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast.error("Update failed");
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    try {
      const response = await fetch("/api/admin/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignIdToUpdate: campaignId, action: "delete" }),
      });
      const data = await response.json();
      if (data.ok) {
        toast.success("Campaign deleted");
        fetchCampaigns();
      } else {
        toast.error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Delete failed");
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const body = { campaignIdToUpdate: id, moderationNotes: notes[id] || "" };
      const r = await fetch('/api/admin/campaigns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await r.json()
      if (j?.ok) {
        toast.success('Notes saved')
      } else {
        toast.error('Failed to save notes')
      }
    } catch {
      toast.error('Failed to save notes')
    }
  }

  const runCompleteEndedJob = async () => {
    setRunningJob(true);
    try {
      const res = await fetch('/api/admin/jobs/complete-ended-campaigns', { method: 'POST' });
      const j = await res.json();
      if (j?.ok) {
        toast.success(`Completed ${j.data?.updatedCount ?? 0} campaigns`);
        fetchCampaigns();
      } else {
        toast.error('Job failed');
      }
    } catch (e) {
      toast.error('Error running job');
    } finally {
      setRunningJob(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, statusFilter]);

  // Derived filtered + sorted list (client-side extra filters)
  const filteredCampaigns = useMemo(() => {
    let list = [...campaigns];
    if (typeFilter !== "all") list = list.filter(c => c.campaignType === typeFilter);
    if (categoryFilter.trim()) list = list.filter(c => c.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
    if (createdFrom) list = list.filter(c => new Date(c.createdAt) >= new Date(createdFrom));
    if (createdTo) list = list.filter(c => new Date(c.createdAt) <= new Date(createdTo));
    if (endingSoonOnly) {
      const soon = Date.now() + 7*24*60*60*1000;
      list = list.filter(c => new Date(c.campaignEndDate).getTime() <= soon);
    }
    if (minProgress > 0) list = list.filter(c => getProgressPercentage(c.amountReceived, c.fundingGoal) >= minProgress);
    // Sort
    list.sort((a,b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'createdAt') return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      if (sortKey === 'endDate') return (new Date(a.campaignEndDate).getTime() - new Date(b.campaignEndDate).getTime()) * dir;
      if (sortKey === 'raised') return ((a.amountReceived||0) - (b.amountReceived||0)) * dir;
      if (sortKey === 'progress') return (getProgressPercentage(a.amountReceived,a.fundingGoal) - getProgressPercentage(b.amountReceived,b.fundingGoal)) * dir;
      return 0;
    });
    return list;
  }, [campaigns, typeFilter, categoryFilter, createdFrom, createdTo, endingSoonOnly, minProgress, sortKey, sortDir]);

  // CSV export of current filtered list
  const exportCsv = () => {
    const rows = filteredCampaigns.map(c => ({
      id: c.id,
      title: c.title,
      status: c.status,
      type: c.campaignType,
      category: c.category,
      creator: c.creatorName,
      location: c.location,
      createdAt: c.createdAt,
      endDate: c.campaignEndDate,
      fundingGoal: c.fundingGoal,
      amountReceived: c.amountReceived,
      progress: getProgressPercentage(c.amountReceived, c.fundingGoal).toFixed(1) + '%',
    }));
    const headers = Object.keys(rows[0] || { id: '', title: '' });
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `campaigns_export_${new Date().toISOString()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported CSV');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "business":
        return "bg-azure-100 text-azure-800";
      case "project":
        return "bg-ocean-100 text-ocean-800";
      case "personal":
        return "bg-teal-100 text-teal-800";
      case "community":
        return "bg-azure-100 text-azure-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SL', {
      style: 'currency',
      currency: 'SLE',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (received: number, goal: number) => {
    return Math.min((received / goal) * 100, 100);
  };

  // KPIs
  const kpis = useMemo(() => {
    const total = pagination?.total || 0;
    const byStatus = campaigns.reduce<Record<string, number>>((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1; return acc;
    }, {});
    const raised = campaigns.reduce((s, c) => s + Number(c.amountReceived || 0), 0);
    const goal = campaigns.reduce((s, c) => s + Number(c.fundingGoal || 0), 0);
    const completion = goal > 0 ? Math.round((raised / goal) * 100) : 0;
    return { total, byStatus, raised, goal, completion };
  }, [campaigns, pagination]);

  const selectedIds = useMemo(() => Object.keys(selected).filter(id => selected[id]), [selected]);
  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    if (checked) campaigns.forEach(c => next[c.id] = true); else campaigns.forEach(c => next[c.id] = false);
    setSelected(next);
  };

  const runBulk = async (action: "active"|"completed"|"rejected"|"delete") => {
    if (selectedIds.length === 0) return toast("No campaigns selected");
    if (action === "delete" && !confirm(`Delete ${selectedIds.length} campaign(s)? This cannot be undone.`)) return;
    try {
      const ops = await Promise.all(selectedIds.map(async id => {
        const body: any = { campaignIdToUpdate: id };
        if (action === "delete") body.action = "delete"; else body.status = action;
        const r = await fetch('/api/admin/campaigns', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        return r.ok;
      }));
      const okCount = ops.filter(Boolean).length;
      toast.success(`Updated ${okCount}/${selectedIds.length}`);
      fetchCampaigns();
    } catch {
      toast.error('Bulk action failed');
    }
  };

  return (
    <section className="space-y-6">
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Campaign Management</h2>
          <p className="text-neutral-600">Review, approve, and moderate campaigns</p>
        </div>
        <Button onClick={runCompleteEndedJob} disabled={runningJob} variant="outline">
          {runningJob ? 'Completing…' : 'Complete Ended Campaigns'}
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-xs text-neutral-500">Total</div><div className="text-2xl font-semibold">{kpis.total}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-neutral-500">Active</div><div className="text-2xl font-semibold">{kpis.byStatus?.active || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-neutral-500">Completed</div><div className="text-2xl font-semibold">{kpis.byStatus?.completed || 0}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-neutral-500">Raised / Goal</div><div className="text-2xl font-semibold">{kpis.completion}%</div></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Search campaigns..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Type"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Input placeholder="Category contains..." value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} />
            <div className="flex items-center gap-2">
              <input id="endingSoon" type="checkbox" checked={endingSoonOnly} onChange={(e)=>setEndingSoonOnly(e.currentTarget.checked)} />
              <label htmlFor="endingSoon" className="text-sm text-neutral-700">Ending in 7 days</label>
            </div>
            <Input type="number" min={0} max={100} value={minProgress} onChange={(e)=>setMinProgress(Number(e.target.value)||0)} placeholder="Min progress %" />
            <div className="flex items-center gap-2">
              <Input type="date" value={createdFrom} onChange={(e)=>setCreatedFrom(e.target.value)} />
              <span className="text-neutral-500">to</span>
              <Input type="date" value={createdTo} onChange={(e)=>setCreatedTo(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Select value={sortKey} onValueChange={(v:any)=>setSortKey(v)}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Sort by"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="endDate">End Date</SelectItem>
                <SelectItem value="raised">Amount Raised</SelectItem>
                <SelectItem value="progress">Progress %</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortDir} onValueChange={(v:any)=>setSortDir(v)}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Order"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Campaigns ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-neutral-500">
              Loading campaigns...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No campaigns found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => {
                const progressPercent = getProgressPercentage(campaign.amountReceived, campaign.fundingGoal);
                const isEndingSoon = new Date(campaign.campaignEndDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-neutral-50">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <Image
                          src={campaign.image}
                          alt={campaign.title}
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{campaign.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(campaign.status)}
                              <Badge className={getTypeColor(campaign.campaignType)}>
                                {campaign.campaignType}
                              </Badge>
                              {isEndingSoon && campaign.status === 'active' && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Ending Soon
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/campaigns/${campaign.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/admin/campaigns/${campaign.id}`}>
                              <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                                Admin
                              </Button>
                            </Link>
                          </div>
                         <details className="mb-2">
                           <summary className="text-sm text-neutral-700 cursor-pointer">Moderation Notes</summary>
                           <textarea
                             className="w-full mt-2 p-2 border rounded"
                             rows={3}
                             placeholder="Add internal notes"
                             value={notes[campaign.id] || ""}
                             onChange={(e)=>setNotes({ ...notes, [campaign.id]: e.target.value })}
                           />
                           <div className="mt-2">
                             <Button size="sm" variant="outline" onClick={()=>saveNotes(campaign.id)}>Save Note</Button>
                           </div>
                         </details>
                         <div className="text-neutral-600">Creator: <span className="font-medium">{campaign.creatorName}</span></div>
                            <div className="text-neutral-600">Location: <span className="font-medium">{campaign.location}</span></div>
                            <div className="text-neutral-600">Category: <span className="font-medium">{campaign.category}</span></div>
                          </div>
                          <div>
                            <div className="text-neutral-600">Created: {new Date(campaign.createdAt).toLocaleDateString()}</div>
                            <div className="text-neutral-600">Ends: {new Date(campaign.campaignEndDate).toLocaleDateString()}</div>
                          </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{formatCurrency(campaign.amountReceived)} of {formatCurrency(campaign.fundingGoal)} ({progressPercent.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-4">
                          {campaign.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCampaignStatus(campaign.id, "active")}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCampaignStatus(campaign.id, "rejected")}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {campaign.status === "active" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCampaignStatus(campaign.id, "completed")}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                Mark Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCampaignStatus(campaign.id, "rejected")}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {campaign.status === "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCampaignStatus(campaign.id, "active")}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              Reactivate
                            </Button>
                          )}
                          {campaign.status === "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCampaignStatus(campaign.id, "active")}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              Reopen
                            </Button>
                          )}
                          {/* Delete always available */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteCampaign(campaign.id)}
                            className="text-red-700 border-red-300 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {(pagination?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-neutral-600">
            Page {currentPage} of {pagination?.totalPages ?? 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === (pagination?.totalPages ?? 1)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
