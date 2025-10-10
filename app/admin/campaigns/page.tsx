"use client";

import { useEffect, useState } from "react";
import { Search, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<CampaignsResponse['pagination'] | null>(null);

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
        fetchCampaigns(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating campaign status:", error);
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
      if (data.ok) fetchCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, statusFilter]);

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
        return "bg-purple-100 text-purple-800";
      case "project":
        return "bg-blue-100 text-blue-800";
      case "personal":
        return "bg-green-100 text-green-800";
      case "community":
        return "bg-orange-100 text-orange-800";
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

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Campaign Management</h2>
          <p className="text-neutral-600">Review, approve, and moderate campaigns</p>
        </div>
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
              {campaigns.map((campaign) => {
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
                          </div>
                        </div>
                        
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {campaign.shortDescription}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-neutral-600">Creator: <span className="font-medium">{campaign.creatorName}</span></div>
                            <div className="text-neutral-600">Location: <span className="font-medium">{campaign.location}</span></div>
                            <div className="text-neutral-600">Category: <span className="font-medium">{campaign.category}</span></div>
                          </div>
                          <div>
                            <div className="text-neutral-600">Created: {new Date(campaign.createdAt).toLocaleDateString()}</div>
                            <div className="text-neutral-600">Ends: {new Date(campaign.campaignEndDate).toLocaleDateString()}</div>
                          </div>
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
      {pagination && pagination.totalPages > 1 && (
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
            Page {currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === pagination.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
