"use client"

import { useState } from "react"
import { Users, DollarSign, TrendingUp, AlertTriangle, Eye, Check, X, Ban, Clock, Activity } from "lucide-react"

const mockAdminData = {
  totalUsers: 2847,
  totalCampaigns: 156,
  totalFunds: 45600000,
  pendingKYC: 23,
  recentUsers: [
    { id: "1", name: "Aminata Kamara", email: "aminata@email.com", joinDate: "2024-01-20", status: "active", kycStatus: "approved" },
    { id: "2", name: "Mohamed Sesay", email: "mohamed@email.com", joinDate: "2024-01-19", status: "active", kycStatus: "pending" },
    { id: "3", name: "Fatima Bangura", email: "fatima@email.com", joinDate: "2024-01-18", status: "suspended", kycStatus: "rejected" },
  ],
  recentCampaigns: [
    { id: "1", title: "Clean Water for Makeni", creator: "Aminata Kamara", status: "active", raised: 2500000, target: 5000000 },
    { id: "2", title: "Solar Power School", creator: "Mohamed Sesay", status: "pending", raised: 0, target: 3000000 },
    { id: "3", title: "Medical Equipment", creator: "Dr. Bangura", status: "active", raised: 4200000, target: 8000000 },
  ],
  activityLogs: [
    { id: "1", user: "Aminata Kamara", action: "Created new campaign", timestamp: "2024-01-20 14:30", ip: "192.168.1.1" },
    { id: "2", user: "Mohamed Sesay", action: "Made donation", timestamp: "2024-01-20 13:15", ip: "192.168.1.2" },
    { id: "3", user: "Admin", action: "Approved KYC", timestamp: "2024-01-20 12:00", ip: "192.168.1.3" },
  ],
}

export default function AdminDashboard() {
  const [data, setData] = useState(mockAdminData)
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleUserAction = (userId: string, action: "suspend" | "activate" | "verify") => {
    setData((prev) => ({
      ...prev,
      recentUsers: prev.recentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: action === "suspend" ? "suspended" : "active",
              kycStatus: action === "verify" ? "approved" : user.kycStatus,
            }
          : user
      ),
    }))
  }

  const handleCampaignAction = (campaignId: string, action: "approve" | "reject") => {
    setData((prev) => ({
      ...prev,
      recentCampaigns: prev.recentCampaigns.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, status: action === "approve" ? "active" : "rejected" } : campaign
      ),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor and manage the FundWaveSL platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-xl font-semibold text-gray-900">{data.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </div>
              <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                <p className="text-xl font-semibold text-gray-900">{data.totalCampaigns}</p>
                <p className="text-xs text-green-500 mt-1">+5 new today</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Funds</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(data.totalFunds)}</p>
                <p className="text-xs text-green-500 mt-1">+8.2% this week</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending KYC</p>
                <p className="text-xl font-semibold text-gray-900">{data.pendingKYC}</p>
                <p className="text-xs text-amber-500 mt-1">Needs attention</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {["overview", "users", "campaigns", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-sky-100 text-sky-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Recent Users */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Users</h3>
                  <button className="text-sm text-sky-600 hover:text-sky-700">View All</button>
                </div>
                <div className="space-y-3">
                  {data.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {user.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Campaigns */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Campaigns</h3>
                  <button className="text-sm text-sky-600 hover:text-sky-700">View All</button>
                </div>
                <div className="space-y-4">
                  {data.recentCampaigns.map((campaign) => {
                    const progress = Math.min((campaign.raised / campaign.target) * 100, 100)
                    return (
                      <div key={campaign.id} className="p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            campaign.status === "active"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">by {campaign.creator}</p>
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">
                            {formatCurrency(campaign.raised)} raised of {formatCurrency(campaign.target)}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-sky-500 to-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          {campaign.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleCampaignAction(campaign.id, "approve")}
                                className="text-green-500 hover:text-green-700"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCampaignAction(campaign.id, "reject")}
                                className="text-red-500 hover:text-red-700"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="text-sky-500 hover:text-sky-700" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">User Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-gray-600">
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.kycStatus === "approved"
                              ? "bg-green-100 text-green-800"
                              : user.kycStatus === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}>
                            {user.kycStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserAction(user.id, "verify")}
                              className="text-green-500 hover:text-green-700"
                              title="Verify KYC"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, user.status === "active" ? "suspend" : "activate")}
                              className="text-amber-500 hover:text-amber-700"
                              title={user.status === "active" ? "Suspend" : "Activate"}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                            <button className="text-sky-500 hover:text-sky-700" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Campaign Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.recentCampaigns.map((campaign) => {
                      const progress = Math.min((campaign.raised / campaign.target) * 100, 100)
                      return (
                        <tr key={campaign.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {campaign.creator}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              campaign.status === "active"
                                ? "bg-green-100 text-green-800"
                                : campaign.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="w-32">
                              <div className="text-xs text-gray-500 mb-1">{Math.round(progress)}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-sky-500 to-indigo-600 h-1.5 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {campaign.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleCampaignAction(campaign.id, "approve")}
                                    className="text-green-500 hover:text-green-700"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleCampaignAction(campaign.id, "reject")}
                                    className="text-red-500 hover:text-red-700"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button className="text-sky-500 hover:text-sky-700" title="View">
                                <Eye className="w-4 h-4" />
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
          )}

          {activeTab === "activity" && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-sky-600 hover:text-sky-700">View All</button>
              </div>
              <div className="space-y-4">
                {data.activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          <span className="font-semibold">{log.user}</span> {log.action}
                        </p>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">IP: {log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
