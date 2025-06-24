"use client"

import { useState } from "react"
import { Flag, Eye, Ban, CheckCircle, AlertTriangle, MessageSquare, Calendar, User } from "lucide-react"

const mockReportedCampaigns = [
  {
    id: "1",
    title: "Help Build School in Freetown",
    creator: "John Kamara",
    reportCount: 5,
    status: "under_review",
    reportReasons: ["Misleading information", "Suspicious activity", "Inappropriate content"],
    reportedDate: "2024-01-20",
    raised: 2500000,
    target: 5000000,
    lastActivity: "2024-01-22",
  },
  {
    id: "2",
    title: "Medical Emergency Fund",
    creator: "Sarah Bangura",
    reportCount: 3,
    status: "resolved",
    reportReasons: ["Duplicate campaign", "Fake documents"],
    reportedDate: "2024-01-18",
    raised: 1200000,
    target: 3000000,
    lastActivity: "2024-01-21",
  },
  {
    id: "3",
    title: "Community Water Project",
    creator: "Mohamed Sesay",
    reportCount: 8,
    status: "suspended",
    reportReasons: ["Fraud", "Misuse of funds", "False claims"],
    reportedDate: "2024-01-15",
    raised: 4500000,
    target: 8000000,
    lastActivity: "2024-01-20",
  },
]

export default function ReportedCampaigns() {
  const [campaigns, setCampaigns] = useState(mockReportedCampaigns)
  const [selectedStatus, setSelectedStatus] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    setCampaigns(
      campaigns.map((campaign) => (campaign.id === campaignId ? { ...campaign, status: newStatus } : campaign)),
    )
  }

  const filteredCampaigns =
    selectedStatus === "all" ? campaigns : campaigns.filter((campaign) => campaign.status === selectedStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reported Campaigns</h1>
          <p className="text-slate-600">Review and manage reported campaigns</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Reports</p>
              <p className="text-2xl font-bold text-slate-900">16</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Under Review</p>
              <p className="text-2xl font-bold text-slate-900">5</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Resolved</p>
              <p className="text-2xl font-bold text-slate-900">8</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Suspended</p>
              <p className="text-2xl font-bold text-slate-900">3</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Reports</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => {
                const progress = (campaign.raised / campaign.target) * 100
                return (
                  <tr key={campaign.id} className="border-b border-slate-100">
                    <td className="py-4 px-4">
                      <div>
                        <h4 className="font-medium text-slate-900">{campaign.title}</h4>
                        <div className="flex items-center text-sm text-slate-600 mt-1">
                          <User className="w-4 h-4 mr-1" />
                          {campaign.creator}
                        </div>
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Reported: {new Date(campaign.reportedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <Flag className="w-4 h-4 text-red-500 mr-1" />
                          <span className="font-medium text-red-600">{campaign.reportCount} reports</span>
                        </div>
                        <div className="space-y-1">
                          {campaign.reportReasons.slice(0, 2).map((reason, index) => (
                            <div key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                              {reason}
                            </div>
                          ))}
                          {campaign.reportReasons.length > 2 && (
                            <div className="text-xs text-slate-500">+{campaign.reportReasons.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-32">
                        <div className="text-sm text-slate-600 mb-1">{Math.round(progress)}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {formatCurrency(campaign.raised)} / {formatCurrency(campaign.target)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-800" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {campaign.status === "under_review" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(campaign.id, "resolved")}
                              className="text-green-600 hover:text-green-800"
                              title="Mark as Resolved"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(campaign.id, "suspended")}
                              className="text-red-600 hover:text-red-800"
                              title="Suspend Campaign"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="text-slate-600 hover:text-slate-800" title="View Reports">
                          <MessageSquare className="w-4 h-4" />
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
