"use client"

import { useState } from "react"
import { RefreshCw, Eye, Check, X, Clock, Search } from "lucide-react"

const mockRefunds = [
  {
    id: "RF001",
    donationId: "D001",
    campaignTitle: "Clean Water Project",
    donor: "John Doe",
    amount: 100000,
    reason: "Campaign cancelled",
    requestDate: "2024-01-20",
    status: "pending",
    method: "Mobile Money",
    originalPayment: "Orange Money",
    phone: "+232 76 123 456",
  },
  {
    id: "RF002",
    donationId: "D002",
    campaignTitle: "Medical Emergency",
    donor: "Jane Smith",
    amount: 250000,
    reason: "Duplicate payment",
    requestDate: "2024-01-18",
    status: "approved",
    method: "Bank Transfer",
    originalPayment: "Bank Transfer",
    processedDate: "2024-01-19",
  },
  {
    id: "RF003",
    donationId: "D003",
    campaignTitle: "School Building",
    donor: "Anonymous",
    amount: 75000,
    reason: "Personal financial hardship",
    requestDate: "2024-01-15",
    status: "rejected",
    method: "Mobile Money",
    originalPayment: "Africell Money",
    rejectionReason: "Campaign already completed",
  },
]

export default function RefundsPage() {
  const [refunds, setRefunds] = useState(mockRefunds)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRefund, setSelectedRefund] = useState<any>(null)

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

  const handleStatusChange = (refundId: string, newStatus: string, reason?: string) => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === refundId
          ? {
              ...r,
              status: newStatus,
              ...(newStatus === "approved" && { processedDate: new Date().toISOString().split("T")[0] }),
              ...(newStatus === "rejected" && reason && { rejectionReason: reason }),
            }
          : r,
      ),
    )
  }

  const filteredRefunds = refunds.filter((refund) => {
    const matchesStatus = selectedStatus === "all" || refund.status === selectedStatus
    const matchesSearch =
      refund.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Refund Requests</h1>
          <p className="text-gray-600">Manage donation refund requests</p>
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
                placeholder="Search refunds..."
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
                {refunds.filter((r) => r.status === "pending").length}
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
                {refunds.filter((r) => r.status === "approved").length}
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
                {refunds.filter((r) => r.status === "rejected").length}
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
                {formatCurrency(refunds.reduce((sum, r) => sum + r.amount, 0))}
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Refunds Table */}
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
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
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
              {filteredRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{refund.id}</div>
                      <div className="text-sm text-gray-500">{refund.donationId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{refund.campaignTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{refund.donor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(refund.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={refund.reason}>
                      {refund.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(refund.status)}`}>
                      {refund.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(refund.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRefund(refund)}
                        className="text-sky-600 hover:text-sky-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {refund.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(refund.id, "approved")}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(refund.id, "rejected", "Does not meet refund criteria")}
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

      {/* Refund Details Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Refund Details</h3>
                <button onClick={() => setSelectedRefund(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Refund ID</label>
                  <p className="text-gray-900">{selectedRefund.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedRefund.status)}`}
                  >
                    {selectedRefund.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Campaign</label>
                  <p className="text-gray-900">{selectedRefund.campaignTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Donor</label>
                  <p className="text-gray-900">{selectedRefund.donor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-gray-900 font-semibold">{formatCurrency(selectedRefund.amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Request Date</label>
                  <p className="text-gray-900">{new Date(selectedRefund.requestDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Original Payment</label>
                  <p className="text-gray-900">{selectedRefund.originalPayment}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Refund Method</label>
                  <p className="text-gray-900">{selectedRefund.method}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Reason</label>
                <p className="text-gray-900">{selectedRefund.reason}</p>
              </div>
              {selectedRefund.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                  <p className="text-red-600">{selectedRefund.rejectionReason}</p>
                </div>
              )}
              {selectedRefund.processedDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Processed Date</label>
                  <p className="text-green-600">{new Date(selectedRefund.processedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
