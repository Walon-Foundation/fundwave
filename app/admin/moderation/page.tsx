"use client"

import { useState } from "react"
import { MessageSquare, Flag, AlertTriangle, Eye, Check, X, Search } from "lucide-react"

const mockModerationData = {
  pendingComments: 12,
  reportedContent: 8,
  flaggedCampaigns: 3,
  totalReports: 45,
  recentComments: [
    {
      id: "1",
      content: "This campaign looks suspicious. The images seem fake.",
      author: "Anonymous User",
      campaign: "Emergency Medical Fund",
      date: "2024-01-20",
      status: "pending",
      reports: 3,
    },
    {
      id: "2",
      content: "Great initiative! Happy to support this cause.",
      author: "John Doe",
      campaign: "Clean Water Project",
      date: "2024-01-19",
      status: "approved",
      reports: 0,
    },
  ],
  reportedItems: [
    {
      id: "1",
      type: "campaign",
      title: "Fake Medical Emergency",
      reporter: "Concerned User",
      reason: "Fraudulent content",
      date: "2024-01-20",
      status: "investigating",
    },
    {
      id: "2",
      type: "comment",
      content: "Inappropriate language and harassment",
      reporter: "Community Member",
      reason: "Harassment",
      date: "2024-01-19",
      status: "resolved",
    },
  ],
}

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600">Monitor and moderate platform content</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Comments</p>
              <p className="text-xl font-semibold text-gray-900">{mockModerationData.pendingComments}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Reported Content</p>
              <p className="text-xl font-semibold text-gray-900">{mockModerationData.reportedContent}</p>
            </div>
            <Flag className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Flagged Campaigns</p>
              <p className="text-xl font-semibold text-gray-900">{mockModerationData.flaggedCampaigns}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-xl font-semibold text-gray-900">{mockModerationData.totalReports}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {["overview", "comments", "reports", "flagged"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Comments */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Comments</h3>
            <div className="space-y-4">
              {mockModerationData.recentComments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{comment.content}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{comment.author}</span>
                        <span className="mx-2">•</span>
                        <span>{comment.campaign}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          comment.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {comment.status}
                      </span>
                      {comment.reports > 0 && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          {comment.reports} reports
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-800">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <X className="w-4 h-4" />
                    </button>
                    <button className="text-sky-600 hover:text-sky-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reported Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
            <div className="space-y-4">
              {mockModerationData.reportedItems.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span
                          className={`px-2 py-1 text-xs rounded-full mr-2 ${
                            item.type === "campaign" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{item.title || item.content}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Reported by {item.reporter}</span>
                        <span className="mx-2">•</span>
                        <span>{item.reason}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === "investigating"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-sky-600 hover:text-sky-800">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "comments" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Comment Moderation</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search comments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockModerationData.recentComments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{comment.content}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium">{comment.author}</span>
                        <span className="mx-2">•</span>
                        <span>{comment.campaign}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          comment.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {comment.status}
                      </span>
                      {comment.reports > 0 && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          {comment.reports} reports
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200">
                        Reject
                      </button>
                      <button className="px-3 py-1 text-sm bg-sky-100 text-sky-800 rounded hover:bg-sky-200">
                        View Context
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
