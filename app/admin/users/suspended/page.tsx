"use client"

import { useState } from "react"
import { Search, Eye, RotateCcw, Trash2, Mail, AlertTriangle } from "lucide-react"

const mockSuspendedUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@email.com",
    phone: "+232 78 123 456",
    suspendedAt: "2024-01-15",
    suspendedBy: "Admin",
    reason: "Fraudulent activity detected",
    suspensionType: "temporary",
    expiresAt: "2024-02-15",
    totalDonated: 0,
    campaignsCreated: 1,
    riskScore: "high",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@email.com",
    phone: "+232 77 234 567",
    suspendedAt: "2024-01-10",
    suspendedBy: "System",
    reason: "Multiple failed KYC attempts",
    suspensionType: "permanent",
    expiresAt: null,
    totalDonated: 150000,
    campaignsCreated: 0,
    riskScore: "medium",
  },
]

export default function SuspendedUsersPage() {
  const [users, setUsers] = useState(mockSuspendedUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleUserAction = (userId: string, action: "reactivate" | "delete") => {
    if (action === "delete") {
      if (confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
        setUsers((prev) => prev.filter((user) => user.id !== userId))
      }
    } else if (action === "reactivate") {
      if (confirm("Are you sure you want to reactivate this user?")) {
        setUsers((prev) => prev.filter((user) => user.id !== userId))
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || user.suspensionType === typeFilter
    return matchesSearch && matchesType
  })

  const getSuspensionTypeColor = (type: string) => {
    return type === "temporary" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Suspended Users</h1>
        <p className="text-slate-600">Manage suspended and banned user accounts</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Suspended</p>
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Temporary</p>
              <p className="text-2xl font-bold text-yellow-600">
                {users.filter((u) => u.suspensionType === "temporary").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Permanent</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter((u) => u.suspensionType === "permanent").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
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
                placeholder="Search suspended users..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="temporary">Temporary</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Suspension Details</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Activity</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-600">{user.email}</div>
                      <div className="text-sm text-slate-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSuspensionTypeColor(user.suspensionType)}`}
                      >
                        {user.suspensionType}
                      </span>
                      <div className="text-sm">
                        <div className="text-slate-900">Reason: {user.reason}</div>
                        <div className="text-slate-600">By: {user.suspendedBy}</div>
                        <div className="text-slate-600">Date: {new Date(user.suspendedAt).toLocaleDateString()}</div>
                        {user.expiresAt && (
                          <div className="text-slate-600">Expires: {new Date(user.expiresAt).toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div>Donated: {formatCurrency(user.totalDonated)}</div>
                      <div className="text-slate-500">Campaigns: {user.campaignsCreated}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(user.riskScore)}`}>
                      {user.riskScore}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-indigo-600 hover:text-indigo-800" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, "reactivate")}
                        className="text-green-600 hover:text-green-800"
                        title="Reactivate User"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800" title="Send Email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, "delete")}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
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
