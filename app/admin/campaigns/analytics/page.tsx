"use client"

import { useState } from "react"
import { TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react"

const mockAnalyticsData = {
  overview: {
    totalCampaigns: 156,
    activeCampaigns: 89,
    completedCampaigns: 45,
    totalRaised: 45600000,
    avgSuccess: 67.3,
    avgDuration: 45,
  },
  categoryPerformance: [
    { category: "Healthcare", campaigns: 34, raised: 12500000, success: 78.2 },
    { category: "Education", campaigns: 28, raised: 9800000, success: 71.4 },
    { category: "Community", campaigns: 25, raised: 8900000, success: 68.0 },
    { category: "Emergency", campaigns: 22, raised: 7200000, success: 81.8 },
    { category: "Environment", campaigns: 18, raised: 4100000, success: 55.6 },
  ],
  monthlyTrends: [
    { month: "Jan", campaigns: 12, raised: 3200000 },
    { month: "Feb", campaigns: 15, raised: 4100000 },
    { month: "Mar", campaigns: 18, raised: 5200000 },
    { month: "Apr", campaigns: 22, raised: 6800000 },
    { month: "May", campaigns: 19, raised: 5900000 },
    { month: "Jun", campaigns: 25, raised: 7400000 },
  ],
  topCampaigns: [
    { id: "1", title: "Emergency Medical Fund", raised: 2800000, target: 3000000, success: 93.3 },
    { id: "2", title: "School Building Project", raised: 2200000, target: 2500000, success: 88.0 },
    { id: "3", title: "Clean Water Initiative", raised: 1900000, target: 2000000, success: 95.0 },
  ],
}

export default function CampaignAnalytics() {
  const [timeRange, setTimeRange] = useState("6m")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Analytics</h1>
          <p className="text-gray-600">Detailed insights into campaign performance</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="community">Community</option>
            <option value="emergency">Emergency</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
              <p className="text-xl font-semibold text-gray-900">{mockAnalyticsData.overview.totalCampaigns}</p>
              <p className="text-xs text-green-500 mt-1">+12% from last period</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-xl font-semibold text-gray-900">{mockAnalyticsData.overview.avgSuccess}%</p>
              <p className="text-xs text-green-500 mt-1">+3.2% improvement</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Raised</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(mockAnalyticsData.overview.totalRaised)}
              </p>
              <p className="text-xs text-green-500 mt-1">+18% growth</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Duration</p>
              <p className="text-xl font-semibold text-gray-900">{mockAnalyticsData.overview.avgDuration} days</p>
              <p className="text-xs text-blue-500 mt-1">Optimal range</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockAnalyticsData.monthlyTrends.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-sky-400 rounded-t"
                  style={{
                    height: `${(data.campaigns / Math.max(...mockAnalyticsData.monthlyTrends.map((d) => d.campaigns))) * 200}px`,
                  }}
                />
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                <span className="text-xs font-medium text-gray-700">{data.campaigns}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="space-y-4">
            {mockAnalyticsData.categoryPerformance.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-xs text-gray-500">{category.success}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-sky-400 h-2 rounded-full"
                      style={{ width: `${category.success}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{category.campaigns} campaigns</span>
                    <span className="text-xs text-gray-500">{formatCurrency(category.raised)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Raised
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAnalyticsData.topCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(campaign.raised)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(campaign.target)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {campaign.success}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
                          style={{ width: `${campaign.success}%` }}
                        />
                      </div>
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
