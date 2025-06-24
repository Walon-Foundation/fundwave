"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Send, Bell, Users, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const mockNotifications = [
  {
    id: "1",
    title: "Campaign Goal Reached",
    message: "Congratulations! Your campaign has reached its funding goal.",
    type: "success",
    audience: "campaign_creators",
    status: "active",
    sentCount: 45,
    openRate: 78.5,
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    title: "New Donation Received",
    message: "You've received a new donation of {amount} for your campaign.",
    type: "info",
    audience: "donors",
    status: "active",
    sentCount: 234,
    openRate: 65.2,
    createdAt: "2024-01-19",
  },
  {
    id: "3",
    title: "KYC Verification Required",
    message: "Please complete your identity verification to continue using FundWaveSL.",
    type: "warning",
    audience: "unverified_users",
    status: "draft",
    sentCount: 0,
    openRate: 0,
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    title: "Weekly Campaign Update",
    message: "Here's your weekly summary of campaign performance and donations.",
    type: "info",
    audience: "all_users",
    status: "scheduled",
    sentCount: 1250,
    openRate: 42.8,
    createdAt: "2024-01-17",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Push Notifications</h1>
          <p className="text-slate-600">Manage automated push notifications and alerts</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Notifications</p>
                <p className="text-2xl font-bold text-slate-900">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter((n) => n.status === "active").length}
                </p>
              </div>
              <Send className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Sent</p>
                <p className="text-2xl font-bold text-slate-900">
                  {notifications.reduce((sum, n) => sum + n.sentCount, 0).toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Open Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(notifications.reduce((sum, n) => sum + n.openRate, 0) / notifications.length).toFixed(1)}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search notifications..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Types</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Notification</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Audience</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-slate-900">{notification.title}</div>
                        <div className="text-sm text-slate-600 line-clamp-2">{notification.message}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Created: {new Date(notification.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getTypeColor(notification.type)}>{notification.type}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-700 capitalize">
                        {notification.audience.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(notification.status)}>{notification.status}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-slate-900">{notification.sentCount.toLocaleString()} sent</div>
                        <div className="text-slate-600">{notification.openRate}% open rate</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
