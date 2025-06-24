"use client"

import { useState } from "react"
import { Search, Eye, Check, X, Clock, AlertTriangle } from "lucide-react"

const mockPendingCampaigns = [
  {
    id: "1",
    title: "Emergency Medical Fund for Children",
    creator: "Dr. Sarah Johnson",
    category: "Healthcare",
    target: 5000000,
    description: "Urgent medical equipment needed for pediatric ward",
    submittedAt: "2024-01-20",
    priority: "high",
    riskScore: "low",
    documents: {
      businessPlan: true,
      identification: true,
      permits: false,
    },
    estimatedReviewTime: "2 hours",
  },
  {
    id: "2",
    title: "Community Solar Project",
    creator: "Green Energy Initiative",
    category: "Environment",
    target: 8000000,
    description: "Installing solar panels for rural community",
    submittedAt: "2024-01-19",
    priority: "medium",
    riskScore: "low",
    documents: {
      businessPlan: true,
      identification: true,
      permits: true,
    },
    estimatedReviewTime: "1 hour",
  },
  {
    id: "3",
    title: "Suspicious Investment Scheme",
    creator: "Unknown Entity",
    category: "Business",
    target: 20000000,
    description: "High return investment opportunity",
    submittedAt: "2024-01-18",
    priority: "urgent",
    riskScore: "high",
    documents: {
      businessPlan: false,
      identification: false,
      permits: false,
    },
    estimatedReviewTime: "4 hours",
  },
]

export default function PendingCampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockPendingCampaigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleCampaignAction = (campaignId: string, action: "approve" | "reject" | "request_info") => {
    if (action === "approve") {
      if (confirm("Are you sure you want to approve this campaign?")) {
        setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId))
      }
    } else if (action === "reject") {
      if (confirm("Are you sure you want to reject this campaign?")) {
        setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId))
      }
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.creator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = priorityFilter === "all" || campaign.priority === priorityFilter
    const matchesRisk = riskFilter === "all" || campaign.riskScore === riskFilter
    return matchesSearch && matchesPriority && matchesRisk
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pending Campaign Approvals</h1>
        <p className="text-slate-600">Review and approve campaigns awaiting verification</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Pending</p>
              <p className="text-2xl font-bold text-slate-900">{campaigns.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Urgent Review</p>
              <p className="text-2xl font-bold text-red-600">
                {campaigns.filter((c) => c.priority === "urgent").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">High Risk</p>
              <p className="text-2xl font-bold text-orange-600">
                {campaigns.filter((c) => c.riskScore === "high").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Review Time</p>
              <p className="text-2xl font-bold text-slate-900">2.3h</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pending campaigns..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">{campaign.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(campaign.priority)}`}>
                    {campaign.priority}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(campaign.riskScore)}`}
                  >
                    {campaign.riskScore} risk
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Creator</p>
                    <p className="font-medium text-slate-900">{campaign.creator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Category</p>
                    <p className="font-medium text-slate-900">{campaign.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Target Amount</p>
                    <p className="font-medium text-slate-900">{formatCurrency(campaign.target)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Submitted</p>
                    <p className="font-medium text-slate-900">{new Date(campaign.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1">Description</p>
                  <p className="text-slate-900">{campaign.description}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-2">Required Documents</p>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      {campaign.documents.businessPlan ? (
                        <Check className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className="text-sm">Business Plan</span>
                    </div>
                    <div className="flex items-center">
                      {campaign.documents.identification ? (
                        <Check className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className="text-sm">ID Verification</span>
                    </div>
                    <div className="flex items-center">
                      {campaign.documents.permits ? (
                        <Check className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span className="text-sm">Permits</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600">Estimated review time: {campaign.estimatedReviewTime}</div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <button className="text-indigo-600 hover:text-indigo-800 p-2" title="View Details">
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCampaignAction(campaign.id, "approve")}
                  className="text-green-600 hover:text-green-800 p-2"
                  title="Approve Campaign"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCampaignAction(campaign.id, "reject")}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="Reject Campaign"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
