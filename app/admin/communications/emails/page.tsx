"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye, Send, Copy } from "lucide-react"

const mockEmailTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to FundWaveSL!",
    category: "onboarding",
    status: "active",
    lastModified: "2024-01-20",
    usage: 1250,
    preview: "Welcome to FundWaveSL! We're excited to have you join our community...",
  },
  {
    id: "2",
    name: "Campaign Approved",
    subject: "Your campaign has been approved!",
    category: "campaign",
    status: "active",
    lastModified: "2024-01-19",
    usage: 89,
    preview: "Great news! Your campaign has been approved and is now live...",
  },
  {
    id: "3",
    name: "Donation Received",
    subject: "You received a new donation!",
    category: "donation",
    status: "active",
    lastModified: "2024-01-18",
    usage: 456,
    preview: "Congratulations! You've received a new donation for your campaign...",
  },
  {
    id: "4",
    name: "KYC Verification Required",
    subject: "Please complete your verification",
    category: "verification",
    status: "draft",
    lastModified: "2024-01-17",
    usage: 0,
    preview: "To continue using FundWaveSL, please complete your identity verification...",
  },
]

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState(mockEmailTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    const matchesStatus = statusFilter === "all" || template.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "onboarding":
        return "bg-blue-100 text-blue-800"
      case "campaign":
        return "bg-purple-100 text-purple-800"
      case "donation":
        return "bg-green-100 text-green-800"
      case "verification":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Email Templates</h1>
          <p className="text-slate-600">Manage automated email communications</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Templates</p>
              <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Templates</p>
              <p className="text-2xl font-bold text-green-600">
                {templates.filter((t) => t.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Usage</p>
              <p className="text-2xl font-bold text-slate-900">
                {templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Draft Templates</p>
              <p className="text-2xl font-bold text-yellow-600">
                {templates.filter((t) => t.status === "draft").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-yellow-600" />
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
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="onboarding">Onboarding</option>
              <option value="campaign">Campaign</option>
              <option value="donation">Donation</option>
              <option value="verification">Verification</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{template.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{template.subject}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                    {template.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 line-clamp-3">{template.preview}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
              <span>Used {template.usage} times</span>
              <span>Modified {new Date(template.lastModified).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button className="text-indigo-600 hover:text-indigo-800" title="Preview">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-800" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-blue-600 hover:text-blue-800" title="Duplicate">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button className="btn-outline text-sm py-1 px-3">Test Send</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
