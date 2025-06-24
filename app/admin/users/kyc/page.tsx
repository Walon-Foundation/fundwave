"use client"

import { useState } from "react"
import { Eye, Check, X, AlertTriangle } from "lucide-react"

const mockKYCApplications = [
  {
    id: "1",
    user: {
      name: "Aminata Kamara",
      email: "aminata@email.com",
      phone: "+232 76 123 456",
    },
    status: "pending",
    submittedAt: "2024-01-20",
    documents: {
      nationalId: { uploaded: true, verified: false },
      proofOfAddress: { uploaded: true, verified: false },
      selfie: { uploaded: true, verified: false },
    },
    riskScore: "low",
    notes: "",
  },
  {
    id: "2",
    user: {
      name: "Mohamed Sesay",
      email: "mohamed@email.com",
      phone: "+232 77 234 567",
    },
    status: "under_review",
    submittedAt: "2024-01-18",
    documents: {
      nationalId: { uploaded: true, verified: true },
      proofOfAddress: { uploaded: true, verified: false },
      selfie: { uploaded: true, verified: true },
    },
    riskScore: "medium",
    notes: "Address document needs verification",
  },
]

export default function KYCVerificationPage() {
  const [applications, setApplications] = useState(mockKYCApplications)
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const handleKYCAction = (applicationId: string, action: "approve" | "reject" | "request_more") => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "pending",
            }
          : app,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const filteredApplications = applications.filter((app) => statusFilter === "all" || app.status === statusFilter)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">KYC Verification</h1>
        <p className="text-slate-600">Review and verify user identity documents</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {applications.filter((a) => a.status === "pending").length}
          </div>
          <div className="text-sm text-slate-600">Pending Review</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter((a) => a.status === "under_review").length}
          </div>
          <div className="text-sm text-slate-600">Under Review</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status === "approved").length}
          </div>
          <div className="text-sm text-slate-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-red-600">
            {applications.filter((a) => a.status === "rejected").length}
          </div>
          <div className="text-sm text-slate-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Documents</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Submitted</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{application.user.name}</div>
                      <div className="text-sm text-slate-600">{application.user.email}</div>
                      <div className="text-sm text-slate-500">{application.user.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                    >
                      {application.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <span className="w-20">ID:</span>
                        {application.documents.nationalId.verified ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-20">Address:</span>
                        {application.documents.proofOfAddress.verified ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-20">Selfie:</span>
                        {application.documents.selfie.verified ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.riskScore === "low"
                          ? "bg-green-100 text-green-800"
                          : application.riskScore === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.riskScore}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApplication(application.id)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Review Documents"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleKYCAction(application.id, "approve")}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleKYCAction(application.id, "reject")}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
