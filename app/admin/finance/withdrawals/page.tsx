"use client"

import { useState } from "react"
import { Download, Eye, Check, X, Clock, Search } from "lucide-react"

const mockWithdrawals = [
  {
    id: "WD001",
    campaignId: "C001",
    campaignTitle: "Clean Water for Makeni",
    creator: "Aminata Kamara",
    amount: 2500000,
    requestDate: "2024-01-20",
    status: "pending",
    method: "Mobile Money",
    phone: "+232 76 123 456",
    reason: "Campaign completed successfully",
    documents: ["completion_report.pdf", "receipts.pdf"],
  },
  {
    id: "WD002",
    campaignId: "C002",
    campaignTitle: "Youth Skills Training",
    creator: "Mohamed Sesay",
    amount: 1800000,
    requestDate: "2024-01-18",
    status: "approved",
    method: "Bank Transfer",
    bankAccount: "ACC-789456123",
    reason: "Milestone reached - 75% completion",
    documents: ["progress_report.pdf"],
    approvedBy: "Admin",
    approvedDate: "2024-01-19",
  },
  {
    id: "WD003",
    campaignId: "C003",
    campaignTitle: "Medical Equipment Fund",
    creator: "Dr. Bangura",
    amount: 3200000,
    requestDate: "2024-01-15",
    status: "rejected",
    method: "Mobile Money",
    phone: "+232 77 987 654",
    reason: "Equipment purchase for hospital",
    rejectionReason: "Insufficient documentation",
    documents: ["invoice.pdf"],
  },
]

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = (withdrawalId: string, newStatus: string, reason?: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status: newStatus,
              ...(newStatus === "approved" && {
                approvedBy: "Admin",
                approvedDate: new Date().toISOString().split("T")[0],
              }),
              ...(newStatus === "rejected" && reason && { rejectionReason: reason }),
            }
          : w,
      ),
    )
  }

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesStatus = selectedStatus === "all" || withdrawal.status === selectedStatus
    const matchesSearch =
      withdrawal.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
          <p className="text-gray-600">Manage campaign fund withdrawal requests</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-outline flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
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
                placeholder="Search withdrawals..."
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
            <option value="processing">Processing</option>
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
                {withdrawals.filter((w) => w.status === "pending").length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-xl font-semibold text-gray-900">
                {withdrawals.filter((w) => w.status === "approved").length}
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
                {withdrawals.filter((w) => w.status === "rejected").length}
              </p>
            </div>
            <X className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(withdrawals.reduce((sum, w) => sum + w.amount, 0))}
              </p>
            </div>
            <Download className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{withdrawal.id}</div>
                      <div className="text-sm text-gray-500">{withdrawal.creator}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{withdrawal.campaignTitle}</div>
                    <div className="text-sm text-gray-500">{withdrawal.campaignId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(withdrawal.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{withdrawal.method}</div>
                    <div className="text-sm text-gray-500">{withdrawal.phone || withdrawal.bankAccount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(withdrawal.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedWithdrawal(withdrawal)}
                        className="text-sky-600 hover:text-sky-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {withdrawal.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(withdrawal.id, "approved")}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(withdrawal.id, "rejected", "Insufficient documentation")}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Withdrawal Details</h3>
                <button onClick={() => setSelectedWithdrawal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Request ID</label>
                  <p className="text-gray-900">{selectedWithdrawal.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedWithdrawal.status)}`}
                  >
                    {selectedWithdrawal.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign</label>
                  <p className="text-gray-900">{selectedWithdrawal.campaignTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Creator</label>
                  <p className="text-gray-900">{selectedWithdrawal.creator}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-gray-900 font-semibold">{formatCurrency(selectedWithdrawal.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Request Date</label>
                  <p className="text-gray-900">{new Date(selectedWithdrawal.requestDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Reason</label>
                <p className="text-gray-900">{selectedWithdrawal.reason}</p>
              </div>
              {selectedWithdrawal.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                  <p className="text-red-600">{selectedWithdrawal.rejectionReason}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Documents</label>
                <div className="space-y-2">
                  {selectedWithdrawal.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{doc}</span>
                      <button className="text-sky-600 hover:text-sky-800 text-sm">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
