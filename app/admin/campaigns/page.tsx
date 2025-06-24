"use client"

import { useState } from "react"
import { Search, Eye, Check, X, Trash2, Flag, Download } from "lucide-react"

// Mock campaigns data
const mockCampaigns = [
  {
    id: "1",
    title: "Clean Water for Makeni Community",
    creator: "Aminata Kamara",
    category: "Community",
    status: "active",
    raised: 2500000,
    target: 5000000,
    donors: 45,
    views: 1250,
    reports: 0,
    createdAt: "2024-01-15",
    endDate: "2024-06-15",
    riskScore: "low",
  },
  {
    id: "2",
    title: "Solar Power for Rural School",
    creator: "Mohamed Sesay",
    category: "Education",
    status: "pending",
    raised: 0,
    target: 3000000,
    donors: 0,
    views: 45,
    reports: 0,
    createdAt: "2024-01-20",
    endDate: "2024-07-20",
    riskScore: "low",
  },
  {
    id: "3",
    title: "Suspicious Medical Equipment",
    creator: "Unknown User",
    category: "Healthcare",
    status: "flagged",
    raised: 500000,
    target: 10000000,
    donors: 5,
    views: 200,
    reports: 12,
    createdAt: "2024-01-18",
    endDate: "2024-08-18",
    riskScore: "high",
  },
]

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleCampaignAction = (campaignId: string, action: "approve" | "reject" | "suspend" | "delete" | "flag") => {
    if (action === "delete") {
      if (confirm("Are you sure you want to permanently delete this campaign? This action cannot be undone.")) {
        setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId))
      }
      return
    }

    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status:
                action === "approve"
                  ? "active"
                  : action === "reject"
                    ? "rejected"
                    : action === "suspend"
                      ? "suspended"
                      : action === "flag"
                        ? "flagged"
                        : campaign.status,
            }
          : campaign,
      ),
    )
  }

  const handleBulkAction = (action: string) => {
    if (selectedCampaigns.length === 0) return

    if (action === "delete") {
      if (
        confirm(`Are you sure you want to delete ${selectedCampaigns.length} campaigns? This action cannot be undone.`)
      ) {
        setCampaigns((prev) => prev.filter((campaign) => !selectedCampaigns.includes(campaign.id)))
        setSelectedCampaigns([])
      }
      return
    }

    setCampaigns((prev) =>
      prev.map((campaign) =>
        selectedCampaigns.includes(campaign.id)
          ? {
              ...campaign,
              status: action === "approve" ? "active" : action === "suspend" ? "suspended" : campaign.status,
            }
          : campaign,
      ),
    )
    setSelectedCampaigns([])
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.creator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "flagged":
        return "bg-orange-100 text-orange-800"
      case "rejected":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getRiskScoreColor = (score: string) => {
    switch (score) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Management</h1>
        <p className="text-slate-600">Monitor and manage all platform campaigns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-slate-900">{campaigns.length}</div>
          <div className="text-sm text-slate-600">Total Campaigns</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {campaigns.filter((c) => c.status === "active").length}
          </div>
          <div className="text-sm text-slate-600">Active</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {campaigns.filter((c) => c.status === "pending").length}
          </div>
          <div className="text-sm text-slate-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">
            {campaigns.filter((c) => c.status === "flagged").length}
          </div>
          <div className="text-sm text-slate-600">Flagged</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-red-600">
            {campaigns.filter((c) => c.status === "suspended").length}
          </div>
          <div className="text-sm text-slate-600">Suspended</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns by title or creator..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Community">Community</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Emergency">Emergency</option>
            </select>
            <button className="btn-outline flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCampaigns.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
            <span className="text-sm text-indigo-700">{selectedCampaigns.length} campaigns selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("approve")}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction("suspend")}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Suspend
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCampaigns(filteredCampaigns.map((c) => c.id))
                      } else {
                        setSelectedCampaigns([])
                      }
                    }}
                    checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Engagement</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Risk</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => {
                const progress = (campaign.raised / campaign.target) * 100
                return (
                  <tr key={campaign.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampaigns([...selectedCampaigns, campaign.id])
                          } else {
                            setSelectedCampaigns(selectedCampaigns.filter((id) => id !== campaign.id))
                          }
                        }}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{campaign.title}</div>
                        <div className="text-sm text-slate-600">by {campaign.creator}</div>
                        <div className="text-sm text-slate-500">{campaign.category}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                      {campaign.reports > 0 && (
                        <div className="text-xs text-red-600 mt-1">{campaign.reports} reports</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-32">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>{formatCurrency(campaign.raised)}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Goal: {formatCurrency(campaign.target)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div>{campaign.donors} donors</div>
                        <div className="text-slate-500">{campaign.views} views</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(campaign.riskScore)}`}
                      >
                        {campaign.riskScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="text-indigo-600 hover:text-indigo-800" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {campaign.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleCampaignAction(campaign.id, "approve")}
                              className="text-green-600 hover:text-green-800"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCampaignAction(campaign.id, "reject")}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleCampaignAction(campaign.id, "flag")}
                          className="text-orange-600 hover:text-orange-800"
                          title="Flag Campaign"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCampaignAction(campaign.id, "delete")}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
