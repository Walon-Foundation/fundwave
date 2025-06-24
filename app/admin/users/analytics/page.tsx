"use client"

import { useState } from "react"
import { Users, TrendingUp, UserPlus, UserMinus, Calendar, Download } from "lucide-react"

const mockAnalytics = {
  totalUsers: 2847,
  activeUsers: 2456,
  newUsersThisMonth: 234,
  churnRate: 2.3,
  userGrowth: [
    { month: "Jan", users: 1200, active: 1050 },
    { month: "Feb", users: 1450, active: 1280 },
    { month: "Mar", users: 1680, active: 1520 },
    { month: "Apr", users: 1920, active: 1750 },
    { month: "May", users: 2180, active: 1980 },
    { month: "Jun", users: 2450, active: 2200 },
    { month: "Jul", users: 2847, active: 2456 },
  ],
  usersByLocation: [
    { district: "Western Area", users: 856, percentage: 30.1 },
    { district: "Bo", users: 342, percentage: 12.0 },
    { district: "Kenema", users: 298, percentage: 10.5 },
    { district: "Makeni", users: 267, percentage: 9.4 },
    { district: "Freetown", users: 234, percentage: 8.2 },
    { district: "Others", users: 850, percentage: 29.8 },
  ],
  userActivity: {
    dailyActive: 1234,
    weeklyActive: 2156,
    monthlyActive: 2456,
  },
}

export default function UserAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">User Analytics</h1>
          <p className="text-slate-600">Detailed insights into user behavior and growth</p>
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
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{mockAnalytics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Users</p>
              <p className="text-2xl font-bold text-slate-900">{mockAnalytics.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8.3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">New Users</p>
              <p className="text-2xl font-bold text-slate-900">{mockAnalytics.newUsersThisMonth}</p>
              <p className="text-sm text-green-600">This month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Churn Rate</p>
              <p className="text-2xl font-bold text-slate-900">{mockAnalytics.churnRate}%</p>
              <p className="text-sm text-red-600">-0.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <UserMinus className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">User Growth Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockAnalytics.userGrowth.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="w-full bg-slate-200 rounded-t relative" style={{ height: "200px" }}>
                  <div
                    className="bg-indigo-600 rounded-t absolute bottom-0 w-full"
                    style={{ height: `${(data.users / 3000) * 100}%` }}
                  />
                  <div
                    className="bg-sky-400 rounded-t absolute bottom-0 w-full opacity-70"
                    style={{ height: `${(data.active / 3000) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-600 rounded mr-2" />
              <span className="text-sm text-slate-600">Total Users</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-sky-400 rounded mr-2" />
              <span className="text-sm text-slate-600">Active Users</span>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">User Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">Daily Active Users</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{mockAnalytics.userActivity.dailyActive}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">Weekly Active Users</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{mockAnalytics.userActivity.weeklyActive}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-slate-600 mr-3" />
                <span className="font-medium text-slate-900">Monthly Active Users</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{mockAnalytics.userActivity.monthlyActive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users by Location */}
      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Users by Location</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">District</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Users</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Percentage</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Growth</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalytics.usersByLocation.map((location, index) => (
                <tr key={location.district} className="border-t border-slate-200">
                  <td className="py-3 px-4 font-medium text-slate-900">{location.district}</td>
                  <td className="py-3 px-4 text-slate-600">{location.users.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-20 bg-slate-200 rounded-full h-2 mr-3">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${location.percentage}%` }} />
                      </div>
                      <span className="text-sm text-slate-600">{location.percentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-green-600">+{Math.floor(Math.random() * 20 + 5)}%</span>
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
