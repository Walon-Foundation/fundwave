"use client"

import { useState } from "react"
import { Users, DollarSign, Target, Download } from "lucide-react"

const mockAnalytics = {
  overview: {
    totalUsers: 2847,
    totalCampaigns: 156,
    totalFundsRaised: 45600000,
    successfulCampaigns: 89,
    averageDonation: 75000,
    platformGrowth: 23.5,
  },
  monthlyData: [
    { month: "Jan", users: 1200, campaigns: 45, funds: 12000000 },
    { month: "Feb", users: 1450, campaigns: 52, funds: 15000000 },
    { month: "Mar", users: 1680, campaigns: 48, funds: 18000000 },
    { month: "Apr", users: 1920, campaigns: 61, funds: 22000000 },
    { month: "May", users: 2180, campaigns: 58, funds: 28000000 },
    { month: "Jun", users: 2450, campaigns: 67, funds: 35000000 },
    { month: "Jul", users: 2847, campaigns: 73, funds: 45600000 },
  ],
  topCampaigns: [
    { title: "Clean Water for Makeni", raised: 4500000, target: 5000000, donors: 234 },
    { title: "Solar Power School", raised: 2800000, target: 3000000, donors: 156 },
    { title: "Medical Equipment", raised: 4200000, target: 8000000, donors: 189 },
    { title: "Community Center", raised: 1900000, target: 2500000, donors: 98 },
  ],
  recentActivity: [
    { action: "New campaign created", user: "Aminata Kamara", time: "2 hours ago" },
    { action: "Large donation received", user: "Mohamed Sesay", time: "4 hours ago" },
    { action: "Campaign goal reached", user: "Dr. Bangura", time: "6 hours ago" },
    { action: "New user registered", user: "Ibrahim Kargbo", time: "8 hours ago" },
  ],
}

export default function AnalyticsOverviewPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Overview</h1>
          <p className="text-slate-600">Comprehensive platform performance insights</p>
        </div>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-outline flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{mockAnalytics.overview.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{mockAnalytics.overview.platformGrowth}% growth</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-slate-900">{mockAnalytics.overview.totalCampaigns}</p>
              <p className="text-sm text-green-600">{mockAnalytics.overview.successfulCampaigns} successful</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Funds Raised</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(mockAnalytics.overview.totalFundsRaised)}
              </p>
              <p className="text-sm text-slate-600">Avg: {formatCurrency(mockAnalytics.overview.averageDonation)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockAnalytics.monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="w-full bg-slate-200 rounded-t relative" style={{ height: "200px" }}>
                  <div
                    className="bg-indigo-600 rounded-t absolute bottom-0 w-full"
                    style={{ height: `${(data.users / 3000) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-slate-600">Monthly User Growth</span>
          </div>
        </div>

        {/* Top Campaigns */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Campaigns</h3>
          <div className="space-y-4">
            {mockAnalytics.topCampaigns.map((campaign, index) => {
              const progress = (campaign.raised / campaign.target) * 100
              return (
                <div key={index} className="border-b border-slate-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-900">{campaign.title}</h4>
                    <span className="text-sm text-slate-600">{campaign.donors} donors</span>
                  </div>
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
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Platform Activity</h3>
        <div className="space-y-4">
          {mockAnalytics.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3" />
                <div>
                  <p className="text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-600">by {activity.user}</p>
                </div>
              </div>
              <span className="text-sm text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
