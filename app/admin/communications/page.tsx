"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import {
  Mail,
  MessageSquare,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import Link from "next/link"

const communicationStats = [
  {
    title: "Emails Sent",
    value: "12,456",
    change: "+8.2% from last month",
    icon: Mail,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "SMS Sent",
    value: "3,234",
    change: "+12.5% from last month",
    icon: Smartphone,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Push Notifications",
    value: "8,901",
    change: "+5.1% from last month",
    icon: MessageSquare,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Open Rate",
    value: "68.4%",
    change: "+2.3% from last month",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const recentCampaigns = [
  {
    id: 1,
    name: "Welcome New Users",
    type: "Email",
    status: "Active",
    sent: 1234,
    opened: 856,
    clicked: 234,
    date: "2024-12-20",
  },
  {
    id: 2,
    name: "Campaign Reminder",
    type: "SMS",
    status: "Completed",
    sent: 567,
    opened: 445,
    clicked: 89,
    date: "2024-12-19",
  },
  {
    id: 3,
    name: "Donation Thank You",
    type: "Email",
    status: "Active",
    sent: 2341,
    opened: 1876,
    clicked: 456,
    date: "2024-12-18",
  },
  {
    id: 4,
    name: "Weekly Newsletter",
    type: "Email",
    status: "Scheduled",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "2024-12-25",
  },
]

export default function AdminCommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "Paused":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case "Scheduled":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Manage email campaigns, SMS, and notifications</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/communications/emails">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communicationStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Communication Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Create and manage email campaigns and templates</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/admin/communications/emails">Manage Emails</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle>SMS Templates</CardTitle>
            <CardDescription>Create and send SMS notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/admin/communications/sms">Manage SMS</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>Send real-time notifications to users</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/admin/communications/notifications">Manage Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Latest communication campaigns and their performance</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {campaign.type === "Email" ? (
                      <Mail className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{campaign.type}</span>
                      <span>•</span>
                      <span>{campaign.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{campaign.sent}</p>
                    <p className="text-xs text-gray-500">Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{campaign.opened}</p>
                    <p className="text-xs text-gray-500">Opened</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{campaign.clicked}</p>
                    <p className="text-xs text-gray-500">Clicked</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(campaign.status)}
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
