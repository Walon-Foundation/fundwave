"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Send, Smartphone, Users, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const mockSMSTemplates = [
  {
    id: "1",
    name: "Donation Confirmation",
    message: "Thank you for your donation of {amount} to {campaign_name}. Your support makes a difference!",
    category: "transactional",
    status: "active",
    usage: 1250,
    deliveryRate: 98.5,
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    name: "Campaign Goal Reached",
    message: "Congratulations! Your campaign '{campaign_name}' has reached its funding goal of {target_amount}.",
    category: "notification",
    status: "active",
    usage: 45,
    deliveryRate: 97.8,
    createdAt: "2024-01-19",
  },
  {
    id: "3",
    name: "KYC Verification Reminder",
    message: "Please complete your identity verification to continue using FundWaveSL. Visit: {verification_link}",
    category: "reminder",
    status: "draft",
    usage: 0,
    deliveryRate: 0,
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    name: "Password Reset",
    message: "Your FundWaveSL password reset code is: {reset_code}. This code expires in 10 minutes.",
    category: "security",
    status: "active",
    usage: 234,
    deliveryRate: 99.2,
    createdAt: "2024-01-17",
  },
]

export default function SMSTemplatesPage() {
  const [templates, setTemplates] = useState(mockSMSTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    const matchesStatus = statusFilter === "all" || template.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "transactional":
        return "bg-blue-100 text-blue-800"
      case "notification":
        return "bg-green-100 text-green-800"
      case "reminder":
        return "bg-yellow-100 text-yellow-800"
      case "security":
        return "bg-red-100 text-red-800"
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
      case "archived":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">SMS Templates</h1>
          <p className="text-slate-600">Manage SMS message templates and automated communications</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Templates</p>
                <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Templates</p>
                <p className="text-2xl font-bold text-green-600">
                  {templates.filter((t) => t.status === "active").length}
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
                <p className="text-sm font-medium text-slate-600">Messages Sent</p>
                <p className="text-2xl font-bold text-slate-900">
                  {templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}
                </p>
              </div>
              <Smartphone className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Delivery Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(templates.reduce((sum, t) => sum + t.deliveryRate, 0) / templates.length).toFixed(1)}%
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
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
                  placeholder="Search templates..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Categories</option>
                <option value="transactional">Transactional</option>
                <option value="notification">Notification</option>
                <option value="reminder">Reminder</option>
                <option value="security">Security</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                    <Badge className={getStatusColor(template.status)}>{template.status}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-sm text-slate-700 line-clamp-3">{template.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Usage:</span>
                    <span className="ml-1 font-medium text-slate-900">{template.usage.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Delivery:</span>
                    <span className="ml-1 font-medium text-slate-900">{template.deliveryRate}%</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Created: {new Date(template.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
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
                  <Button variant="outline" size="sm">
                    Test Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
