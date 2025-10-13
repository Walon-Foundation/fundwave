"use client";

import { useEffect, useState } from "react";
import { Search, AlertTriangle, Eye, Flag, User, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Report {
  id: string;
  type: "campaign" | "user";
  targetId: string;
  targetTitle: string;
  reason: string;
  description: string | null;
  reporterId: string | null;
  reporterName: string;
  status: "pending" | "investigating" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  // Enriched fields from API
  campaign?: { id: string; title: string; creatorId: string; creatorName: string } | null;
  reporter?: { id?: string; name?: string; email?: string } | null;
}

interface ReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<ReportsResponse['pagination'] | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "15",
        status: statusFilter,
        type: typeFilter,
      });
      
      const response = await fetch(`/api/admin/reports?${params}`);
      const data = await response.json();
      
      if (data.ok) {
        setReports(data.data.reports);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string, priority?: string) => {
    try {
      const body: any = {
        reportId,
        status: newStatus,
      };
      
      if (priority) {
        body.priority = priority;
      }
      
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      const data = await response.json();
      if (data.ok) {
        fetchReports(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, typeFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "investigating":
        return <Badge className="bg-blue-100 text-blue-800">Investigating</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low Priority</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "campaign":
        return <Target className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Reports Management</h2>
          <p className="text-neutral-600">Review and manage content reports</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="campaign">Campaign Reports</SelectItem>
                <SelectItem value="user">User Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Reports ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-neutral-500">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No reports found
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-neutral-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        report.type === 'campaign' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {report.type === 'campaign' ? 'Campaign Report' : 'User Report'}: {report.targetTitle}
                        </h3>
                        <div className="text-sm text-neutral-600">
                          {report.type === 'campaign' && report.campaign ? (
                            <>
                              Creator: <span className="font-medium">{report.campaign.creatorName}</span>
                            </>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {report.type === 'campaign' ? (
                        <Link href={`/campaigns/${report.targetId}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Campaign
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <Eye className="w-4 h-4 mr-1" />
                          View User
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-3 mb-3">
                    <div className="text-sm">
                      <div className="font-medium text-neutral-700 mb-1">Reason:</div>
                      <div className="text-neutral-600">{report.reason}</div>
                      
                      {report.description && (
                        <>
                          <div className="font-medium text-neutral-700 mt-2 mb-1">Description:</div>
                          <div className="text-neutral-600">{report.description}</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
                    <div>
                      Reported by: <span className="font-medium">{report.reporter?.name || report.reporterName}</span>
                      {report.reporter?.email && (
                        <span className="text-neutral-500 ml-2">({report.reporter.email})</span>
                      )}
                    </div>
                    <div>
                      {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {report.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, "investigating")}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Start Investigation
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, "resolved")}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Mark Resolved
                        </Button>
                        {report.priority !== "high" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateReportStatus(report.id, report.status, "high")}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Mark High Priority
                          </Button>
                        )}
                      </>
                    )}
                    
                    {report.status === "investigating" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, "resolved")}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Mark Resolved
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, "pending")}
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        >
                          Back to Pending
                        </Button>
                      </>
                    )}
                    
                    {report.status === "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReportStatus(report.id, "investigating")}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Reopen Investigation
                      </Button>
                    )}
                  </div>
                </div>
              ))}
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
