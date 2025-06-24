"use client"

import { useState } from "react"
import { Search, Eye, Calendar, MapPin, Activity } from "lucide-react"

const mockUserActivity = [
  {
    id: "1",
    user: {
      name: "Aminata Kamara",
      email: "aminata@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Created campaign",
    details: "Clean Water for Makeni Community",
    timestamp: "2024-01-20 14:30:00",
    ipAddress: "192.168.1.100",
    location: "Freetown, Sierra Leone",
    device: "Chrome on Windows",
    status: "success",
  },
  {
    id: "2",
    user: {
      name: "Mohamed Sesay",
      email: "mohamed@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Made donation",
    details: "Donated SLL 50,000 to Solar Power School",
    timestamp: "2024-01-20 13:15:00",
    ipAddress: "192.168.1.101",
    location: "Bo, Sierra Leone",
    device: "Safari on iPhone",
    status: "success",
  },
  {
    id: "3",
    user: {
      name: "Fatima Bangura",
      email: "fatima@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Failed login attempt",
    details: "Multiple failed password attempts",
    timestamp: "2024-01-20 12:45:00",
    ipAddress: "192.168.1.102",
    location: "Makeni, Sierra Leone",
    device: "Chrome on Android",
    status: "failed",
  },
  {
    id: "4",
    user: {
      name: "Ibrahim Kargbo",
      email: "ibrahim@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Updated profile",
    details: "Changed profile picture and bio",
    timestamp: "2024-01-20 11:20:00",
    ipAddress: "192.168.1.103",
    location: "Kenema, Sierra Leone",
    device: "Firefox on Windows",
    status: "success",
  },
]

export default function UserActivityPage() {
  const [activities, setActivities] = useState(mockUserActivity)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || activity.action.toLowerCase().includes(actionFilter.toLowerCase())
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter
    return matchesSearch && matchesAction && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return "🔐"
    if (action.includes("donation")) return "💰"
    if (action.includes("campaign")) return "📢"
    if (action.includes("profile")) return "👤"
    return "📝"
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">User Activity</h1>
        <p className="text-slate-600">Monitor user actions and system events</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Activities</p>
              <p className="text-2xl font-bold text-slate-900">{activities.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Successful Actions</p>
              <p className="text-2xl font-bold text-green-600">
                {activities.filter((a) => a.status === "success").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Failed Actions</p>
              <p className="text-2xl font-bold text-red-600">
                {activities.filter((a) => a.status === "failed").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Unique Users</p>
              <p className="text-2xl font-bold text-slate-900">{new Set(activities.map((a) => a.user.email)).size}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
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
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Actions</option>
              <option value="login">Login</option>
              <option value="donation">Donation</option>
              <option value="campaign">Campaign</option>
              <option value="profile">Profile</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
              <div className="flex-shrink-0">
                <img
                  src={activity.user.avatar || "/placeholder.svg"}
                  alt={activity.user.name}
                  className="w-10 h-10 rounded-full bg-slate-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getActionIcon(activity.action)}</span>
                    <span className="font-medium text-slate-900">{activity.user.name}</span>
                    <span className="text-slate-600">{activity.action.toLowerCase()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-sm text-slate-600">{activity.details}</div>
                <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {activity.location}
                  </div>
                  <div>IP: {activity.ipAddress}</div>
                  <div>{activity.device}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
