"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  MessageCircle,
  Edit,
  Trash2,
  BarChart3,
  Share2,
  Download,
  Bell,
  Target,
  Pause,
  Play,
} from "lucide-react"
// import DashboardSetupWizard from "../../components/dashboard-setup-wizard"

// Enhanced mock creator data
const mockCreatorData = {
  totalRaised: 7500000,
  totalDonors: 156,
  activeCampaigns: 2,
  totalCampaigns: 3,
  totalViews: 15420,
  conversionRate: 3.2,
  avgDonation: 48077,
  monthlyGrowth: 12.5,
  campaigns: [
    {
      id: "1",
      title: "Clean Water for Makeni Community",
      status: "active",
      raised: 2500000,
      target: 5000000,
      donors: 45,
      views: 1250,
      comments: 12,
      updates: 2,
      shares: 89,
      conversionRate: 3.6,
      avgDonation: 55556,
      createdAt: "2024-01-15",
      endDate: "2024-06-15",
      daysLeft: 145,
      recentActivity: [
        { type: "donation", amount: 50000, donor: "Anonymous", time: "2 hours ago" },
        { type: "comment", content: "Great initiative!", user: "Mohamed B.", time: "5 hours ago" },
        { type: "share", platform: "Facebook", time: "1 day ago" },
      ],
      analytics: {
        dailyViews: [12, 15, 8, 22, 18, 25, 30],
        dailyDonations: [2, 1, 0, 3, 2, 4, 1],
        topReferrers: ["Facebook", "WhatsApp", "Direct"],
        donorDemographics: { "18-25": 20, "26-35": 35, "36-45": 30, "46+": 15 },
      },
    },
    {
      id: "2",
      title: "Youth Skills Training Center",
      status: "active",
      raised: 3100000,
      target: 6000000,
      donors: 56,
      views: 890,
      comments: 8,
      updates: 3,
      shares: 45,
      conversionRate: 6.3,
      avgDonation: 55357,
      createdAt: "2024-01-10",
      endDate: "2024-05-10",
      daysLeft: 89,
      recentActivity: [
        { type: "donation", amount: 100000, donor: "Fatima K.", time: "1 day ago" },
        { type: "update", title: "Construction Progress", time: "3 days ago" },
      ],
      analytics: {
        dailyViews: [8, 12, 10, 15, 20, 18, 22],
        dailyDonations: [1, 2, 1, 1, 3, 2, 2],
        topReferrers: ["WhatsApp", "Direct", "Twitter"],
        donorDemographics: { "18-25": 25, "26-35": 40, "36-45": 25, "46+": 10 },
      },
    },
    {
      id: "3",
      title: "Emergency Food Relief",
      status: "completed",
      raised: 1900000,
      target: 2000000,
      donors: 55,
      views: 2100,
      comments: 25,
      updates: 5,
      shares: 156,
      conversionRate: 2.6,
      avgDonation: 34545,
      createdAt: "2023-12-01",
      endDate: "2024-01-01",
      daysLeft: 0,
      recentActivity: [],
      analytics: {
        dailyViews: [45, 52, 38, 60, 55, 48, 42],
        dailyDonations: [3, 4, 2, 5, 4, 3, 2],
        topReferrers: ["Facebook", "WhatsApp", "Instagram"],
        donorDemographics: { "18-25": 15, "26-35": 30, "36-45": 35, "46+": 20 },
      },
    },
  ],
  notifications: [
    { id: "1", type: "donation", message: "New donation of SLL 50,000 received", time: "2 hours ago", read: false },
    { id: "2", type: "comment", message: "New comment on Clean Water campaign", time: "5 hours ago", read: false },
    { id: "3", type: "milestone", message: "Youth Skills campaign reached 50% funding", time: "1 day ago", read: true },
    { id: "4", type: "update", message: "Campaign update published successfully", time: "2 days ago", read: true },
  ],
}

export default function CreatorDashboard() {
  const [data, setData] = useState(mockCreatorData)
  const [selectedCampaign, setSelectedCampaign] = useState<string>("1")
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [showWizard, setShowWizard] = useState(false)

  // Check if this is user's first time on dashboard
  useEffect(() => {
    const hasSeenDashboard = localStorage.getItem("hasSeenDashboard")
    if (!hasSeenDashboard) {
      setIsFirstTime(true)
      localStorage.setItem("hasSeenDashboard", "true")
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const handleCampaignAction = (campaignId: string, action: string) => {
    console.log(`${action} campaign ${campaignId}`)
    // Implement campaign actions
  }

  const handleWizardComplete = () => {
    localStorage.setItem("dashboardTourCompleted", "true")
    setShowWizard(false)
  }

  const handleWizardSkip = () => {
    localStorage.setItem("dashboardTourSkipped", "true")
    setShowWizard(false)
  }

  const selectedCampaignData = data.campaigns.find((c) => c.id === selectedCampaign)

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Creator Dashboard</h1>
            <p className="text-xl text-slate-600">Manage your campaigns and track your impact</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-600 cursor-pointer" />
              {data.notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {data.notifications.filter((n) => !n.read).length}
                </span>
              )}
            </div>
            <Link href="/create-campaign" className="btn-primary flex items-center create-campaign-btn">
              <Plus className="w-5 h-5 mr-2" />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stats-overview">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Raised</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(data.totalRaised)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+{data.monthlyGrowth}% this month</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Donors</p>
                <p className="text-2xl font-bold text-slate-900">{data.totalDonors}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-sm text-slate-600">Avg: {formatCurrency(data.avgDonation)}</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-900">{data.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-sm text-slate-600">Conversion: {data.conversionRate}%</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-slate-900">{data.activeCampaigns}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-sm text-slate-600">{data.totalCampaigns} total campaigns</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6 dashboard-tabs">
          <nav className="flex space-x-8">
            {["overview", "campaigns", "analytics", "notifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab}
                {tab === "notifications" && data.notifications.filter((n) => !n.read).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {data.notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="card mb-6 recent-activity">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {data.campaigns
                    .flatMap((c) => c.recentActivity.map((a) => ({ ...a, campaignTitle: c.title })))
                    .slice(0, 10)
                    .map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              activity.type === "donation"
                                ? "bg-green-100"
                                : activity.type === "comment"
                                  ? "bg-blue-100"
                                  : activity.type === "share"
                                    ? "bg-purple-100"
                                    : "bg-slate-100"
                            }`}
                          >
                            {activity.type === "donation" && <DollarSign className="w-4 h-4 text-green-600" />}
                            {activity.type === "comment" && <MessageCircle className="w-4 h-4 text-blue-600" />}
                            {activity.type === "share" && <Share2 className="w-4 h-4 text-purple-600" />}
                            {activity.type === "update" && <Bell className="w-4 h-4 text-slate-600" />}
                          </div>
                          <div>
                            <p className="text-slate-900">
                              {activity.type === "donation" &&
                                `New donation of ${formatCurrency(activity?.amount as number)} from ${activity.donor}`}
                              {activity.type === "comment" && `New comment: "${activity.content as string}" by ${activity.user}`}
                              {activity.type === "share" && `Campaign shared on ${activity?.platform}`}
                              {activity.type === "update" && `Campaign update: ${activity?.title}`}
                            </p>
                            <p className="text-sm text-slate-500">{activity.campaignTitle}</p>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">{activity.time}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <div className="card mb-6 quick-actions">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/create-campaign" className="btn-primary w-full flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Campaign
                  </Link>
                  <button className="btn-outline w-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </button>
                  <button className="btn-outline w-full flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Tips</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Add campaign updates</p>
                    <p className="text-xs text-blue-600">Regular updates increase donor engagement by 40%</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Share on social media</p>
                    <p className="text-xs text-green-600">Social sharing can double your reach</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800 font-medium">Thank your donors</p>
                    <p className="text-xs text-purple-600">Personal thanks increase repeat donations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div>
            {/* Enhanced Campaigns Table */}
            <div className="card campaigns-table">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Your Campaigns</h2>
                <div className="flex items-center gap-4">
                  <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                    <option>All Campaigns</option>
                    <option>Active</option>
                    <option>Completed</option>
                    <option>Paused</option>
                  </select>
                  <button className="btn-outline flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Campaign</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Performance</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Time Left</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.map((campaign) => {
                      const progress = (campaign.raised / campaign.target) * 100
                      return (
                        <tr key={campaign.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-1">{campaign.title}</h3>
                              <p className="text-sm text-slate-600">
                                Created {new Date(campaign.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                            >
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="w-32">
                              <div className="flex justify-between text-sm text-slate-600 mb-1">
                                <span>{formatCurrency(campaign.raised)}</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              <div className="text-xs text-slate-500 mt-1">Goal: {formatCurrency(campaign.target)}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm space-y-1">
                              <div className="flex items-center">
                                <Users className="w-3 h-3 mr-1 text-slate-400" />
                                <span>{campaign.donors} donors</span>
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1 text-slate-400" />
                                <span>{campaign.views} views</span>
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1 text-slate-400" />
                                <span>{campaign.comments} comments</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              {campaign.status === "completed" ? (
                                <span className="text-green-600 font-medium">Completed</span>
                              ) : campaign.daysLeft > 0 ? (
                                <div>
                                  <div className="font-medium text-slate-900">{campaign.daysLeft} days</div>
                                  <div className="text-slate-500">remaining</div>
                                </div>
                              ) : (
                                <span className="text-red-600 font-medium">Expired</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/campaigns/${campaign.id}`}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="View Campaign"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/campaigns/${campaign.id}/updates`}
                                className="text-green-600 hover:text-green-800"
                                title="Manage Updates"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/campaigns/${campaign.id}/edit`}
                                className="text-slate-600 hover:text-slate-800"
                                title="Edit Campaign"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              {campaign.status === "active" && (
                                <button
                                  onClick={() => handleCampaignAction(campaign.id, "pause")}
                                  className="text-yellow-600 hover:text-yellow-800"
                                  title="Pause Campaign"
                                >
                                  <Pause className="w-4 h-4" />
                                </button>
                              )}
                              {campaign.status === "paused" && (
                                <button
                                  onClick={() => handleCampaignAction(campaign.id, "resume")}
                                  className="text-green-600 hover:text-green-800"
                                  title="Resume Campaign"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleCampaignAction(campaign.id, "delete")}
                                className="text-red-600 hover:text-red-800"
                                title="Delete Campaign"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        )}

        {activeTab === "analytics" && selectedCampaignData && (
          <div className="analytics-section">
            {/* Campaign Selector */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {data.campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
              <button className="btn-outline flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>

            {/* Analytics Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Views Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Views</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {selectedCampaignData.analytics.dailyViews.map((views, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-indigo-500 rounded-t"
                        style={{
                          height: `${(views / Math.max(...selectedCampaignData.analytics.dailyViews)) * 200}px`,
                        }}
                      />
                      <span className="text-xs text-slate-500 mt-2">{views}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donations Chart */}
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Donations</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {selectedCampaignData.analytics.dailyDonations.map((donations, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{
                          height: `${(donations / Math.max(...selectedCampaignData.analytics.dailyDonations)) * 200}px`,
                        }}
                      />
                      <span className="text-xs text-slate-500 mt-2">{donations}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Referrers */}
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Referrers</h3>
                <div className="space-y-3">
                  {selectedCampaignData.analytics.topReferrers.map((referrer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-700">{referrer}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{
                              width: `${((index + 1) / selectedCampaignData.analytics.topReferrers.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-slate-600">
                          {Math.round(((index + 1) / selectedCampaignData.analytics.topReferrers.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donor Demographics */}
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Donor Demographics</h3>
                <div className="space-y-3">
                  {Object.entries(selectedCampaignData.analytics.donorDemographics).map(([age, percentage]) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-slate-700">{age} years</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                          <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm text-slate-600">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-2xl font-bold text-slate-900">{selectedCampaignData.conversionRate}%</div>
                <div className="text-sm text-slate-600">Conversion Rate</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(selectedCampaignData.avgDonation)}
                </div>
                <div className="text-sm text-slate-600">Avg Donation</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-slate-900">{selectedCampaignData.shares}</div>
                <div className="text-sm text-slate-600">Total Shares</div>
              </div>
              <div className="card text-center">
                <div className="text-2xl font-bold text-slate-900">{selectedCampaignData.updates}</div>
                <div className="text-sm text-slate-600">Updates Posted</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="card notifications-section">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Notifications</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">Mark all as read</button>
            </div>

            <div className="space-y-4">
              {data.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? "bg-white border-slate-200" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          notification.type === "donation"
                            ? "bg-green-100"
                            : notification.type === "comment"
                              ? "bg-blue-100"
                              : notification.type === "milestone"
                                ? "bg-purple-100"
                                : "bg-slate-100"
                        }`}
                      >
                        {notification.type === "donation" && <DollarSign className="w-4 h-4 text-green-600" />}
                        {notification.type === "comment" && <MessageCircle className="w-4 h-4 text-blue-600" />}
                        {notification.type === "milestone" && <Target className="w-4 h-4 text-purple-600" />}
                        {notification.type === "update" && <Bell className="w-4 h-4 text-slate-600" />}
                      </div>
                      <div>
                        <p className="text-slate-900">{notification.message}</p>
                        <p className="text-sm text-slate-500">{notification.time}</p>
                      </div>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Setup Wizard */}
      {/* <DashboardSetupWizard isFirstTime={isFirstTime} onComplete={handleWizardComplete} onSkip={handleWizardSkip} /> */}
    </div>
  )
}
