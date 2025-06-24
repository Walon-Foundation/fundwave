"use client"

import { useState } from "react"
import { Search, Eye, Ban, Trash2, Mail, Download } from "lucide-react"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Aminata Kamara",
    email: "aminata@email.com",
    phone: "+232 76 123 456",
    location: "Freetown, Western Area",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20",
    status: "active",
    kycStatus: "approved",
    totalDonated: 750000,
    campaignsCreated: 2,
    campaignsSupported: 12,
    riskScore: "low",
  },
  {
    id: "2",
    name: "Mohamed Sesay",
    email: "mohamed@email.com",
    phone: "+232 77 234 567",
    location: "Bo, Southern Province",
    joinDate: "2024-01-10",
    lastActive: "2024-01-19",
    status: "active",
    kycStatus: "pending",
    totalDonated: 250000,
    campaignsCreated: 1,
    campaignsSupported: 5,
    riskScore: "medium",
  },
  {
    id: "3",
    name: "Fatima Bangura",
    email: "fatima@email.com",
    phone: "+232 78 345 678",
    location: "Makeni, Northern Province",
    joinDate: "2024-01-05",
    lastActive: "2024-01-18",
    status: "suspended",
    kycStatus: "rejected",
    totalDonated: 0,
    campaignsCreated: 0,
    campaignsSupported: 0,
    riskScore: "high",
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")
  const [showUserModal, setShowUserModal] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleUserAction = (userId: string, action: "suspend" | "activate" | "delete" | "verify" | "reject") => {
    if (action === "delete") {
      if (confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
        setUsers((prev) => prev.filter((user) => user.id !== userId))
      }
      return
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: action === "suspend" ? "suspended" : action === "activate" ? "active" : user.status,
              kycStatus: action === "verify" ? "approved" : action === "reject" ? "rejected" : user.kycStatus,
            }
          : user,
      ),
    )
  }

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return

    if (action === "delete") {
      if (confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
        setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))
        setSelectedUsers([])
      }
      return
    }

    setUsers((prev) =>
      prev.map((user) =>
        selectedUsers.includes(user.id)
          ? {
              ...user,
              status: action === "suspend" ? "suspended" : action === "activate" ? "active" : user.status,
            }
          : user,
      ),
    )
    setSelectedUsers([])
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter
    return matchesSearch && matchesStatus && matchesKyc
  })

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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
        <p className="text-slate-600">Manage and monitor all platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-slate-900">{users.length}</div>
          <div className="text-sm text-slate-600">Total Users</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</div>
          <div className="text-sm text-slate-600">Active Users</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {users.filter((u) => u.kycStatus === "pending").length}
          </div>
          <div className="text-sm text-slate-600">Pending KYC</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="text-2xl font-bold text-red-600">{users.filter((u) => u.status === "suspended").length}</div>
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
                placeholder="Search users by name or email..."
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
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All KYC</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="btn-outline flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
            <span className="text-sm text-indigo-700">{selectedUsers.length} users selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Activate
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

      {/* Users Table */}
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
                        setSelectedUsers(filteredUsers.map((u) => u.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">KYC</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Activity</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                        }
                      }}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-600">{user.email}</div>
                      <div className="text-sm text-slate-500">{user.location}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.kycStatus === "approved"
                          ? "bg-green-100 text-green-800"
                          : user.kycStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div>Donated: {formatCurrency(user.totalDonated)}</div>
                      <div className="text-slate-500">
                        {user.campaignsCreated} created, {user.campaignsSupported} supported
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(user.riskScore)}`}>
                      {user.riskScore}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowUserModal(user.id)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, user.status === "active" ? "suspend" : "activate")}
                        className="text-yellow-600 hover:text-yellow-800"
                        title={user.status === "active" ? "Suspend" : "Activate"}
                      >
                        <Ban className="w-4 h-4" />
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
