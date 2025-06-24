"use client"

import { useState } from "react"
import { MessageCircle, Check, X, Search, Flag } from "lucide-react"

const mockComments = [
  {
    id: "1",
    content: "This campaign looks suspicious. The images seem fake and the story doesn't add up.",
    author: "Anonymous User",
    authorEmail: "user@example.com",
    campaign: "Emergency Medical Fund",
    campaignId: "C001",
    date: "2024-01-20T14:30:00",
    status: "pending",
    reports: 3,
    reportReasons: ["Spam", "Inappropriate", "Misinformation"],
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    content: "Great initiative! Happy to support this cause. Keep up the good work!",
    author: "John Doe",
    authorEmail: "john@example.com",
    campaign: "Clean Water Project",
    campaignId: "C002",
    date: "2024-01-19T10:15:00",
    status: "approved",
    reports: 0,
    reportReasons: [],
    ipAddress: "192.168.1.101",
  },
  {
    id: "3",
    content: "I donated but never received any updates. This might be a scam!",
    author: "Concerned Donor",
    authorEmail: "donor@example.com",
    campaign: "School Building Fund",
    campaignId: "C003",
    date: "2024-01-18T16:45:00",
    status: "flagged",
    reports: 5,
    reportReasons: ["Defamation", "False Claims"],
    ipAddress: "192.168.1.102",
  },
]

export default function CommentsModeration() {
  const [comments, setComments] = useState(mockComments)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComment, setSelectedComment] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "flagged":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (commentId: string, newStatus: string) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === commentId ? { ...comment, status: newStatus } : comment)),
    )
  }

  const filteredComments = comments.filter((comment) => {
    const matchesStatus = selectedStatus === "all" || comment.status === selectedStatus
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.campaign.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comment Moderation</h1>
          <p className="text-gray-600">Review and moderate user comments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-gray-900">
                {comments.filter((c) => c.status === "pending").length}
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Flagged</p>
              <p className="text-xl font-semibold text-gray-900">
                {comments.filter((c) => c.status === "flagged").length}
              </p>
            </div>
            <Flag className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-xl font-semibold text-gray-900">
                {comments.filter((c) => c.status === "approved").length}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-xl font-semibold text-gray-900">
                {comments.filter((c) => c.status === "rejected").length}
              </p>
            </div>
            <X className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-gray-900 mr-2">{comment.author}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(comment.status)}`}>
                    {comment.status}
                  </span>
                  {comment.reports > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      {comment.reports} reports
                    </span>
                  )}
                </div>
                <p className="text-gray-900 mb-3 leading-relaxed">{comment.content}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Campaign: {comment.campaign}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(comment.date).toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <span>IP: {comment.ipAddress}</span>
                </div>
              </div>
            </div>

            {comment.reportReasons.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-800 mb-1">Report Reasons:</p>
                <div className="flex flex-wrap gap-1">
                  {comment.reportReasons.map((reason, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {comment.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(comment.id, "approved")}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(comment.id, "rejected")}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                {comment.status === "flagged" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(comment.id, "approved")}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(comment.id, "rejected")}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedComment(comment)}
                  className="px-3 py-1 text-sm bg-sky-100 text-sky-800 rounded hover:bg-sky-200 transition-colors"
                >
                  View Details
                </button>
              </div>
              <div className="text-sm text-gray-500">ID: {comment.id}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Details Modal */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Comment Details</h3>
                <button onClick={() => setSelectedComment(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Comment ID</label>
                  <p className="text-gray-900">{selectedComment.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedComment.status)}`}
                  >
                    {selectedComment.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Author</label>
                  <p className="text-gray-900">{selectedComment.author}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedComment.authorEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign</label>
                  <p className="text-gray-900">{selectedComment.campaign}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-900">{new Date(selectedComment.date).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IP Address</label>
                  <p className="text-gray-900">{selectedComment.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reports</label>
                  <p className="text-gray-900">{selectedComment.reports}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Comment Content</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedComment.content}</p>
                </div>
              </div>
              {selectedComment.reportReasons.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Report Reasons</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedComment.reportReasons.map((reason: string, index: number) => (
                      <span key={index} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
