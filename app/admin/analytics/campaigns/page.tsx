"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, DollarSign, Users, Award, AlertCircle, CheckCircle, Clock, Download } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const campaignStats = [
  {
    title: "Total Campaigns",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Campaigns",
    value: "456",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Successful Campaigns",
    value: "789",
    change: "+15.3%",
    trend: "up",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Success Rate",
    value: "68.4%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const campaignPerformanceData = [
  { month: "Jan", created: 45, successful: 32, failed: 8, active: 5 },
  { month: "Feb", created: 52, successful: 38, failed: 9, active: 5 },
  { month: "Mar", created: 48, successful: 35, failed: 7, active: 6 },
  { month: "Apr", created: 61, successful: 42, failed: 12, active: 7 },
  { month: "May", created: 58, successful: 41, failed: 10, active: 7 },
  { month: "Jun", created: 67, successful: 48, failed: 11, active: 8 },
  { month: "Jul", created: 72, successful: 52, failed: 12, active: 8 },
  { month: "Aug", created: 69, successful: 49, failed: 13, active: 7 },
  { month: "Sep", created: 75, successful: 54, failed: 14, active: 7 },
  { month: "Oct", created: 78, successful: 56, failed: 15, active: 7 },
  { month: "Nov", created: 82, successful: 59, failed: 16, active: 7 },
  { month: "Dec", created: 85, successful: 62, failed: 16, active: 7 },
]

const categoryData = [
  { name: "Education", value: 28, color: "#3B82F6", campaigns: 345 },
  { name: "Healthcare", value: 22, color: "#10B981", campaigns: 271 },
  { name: "Emergency", value: 18, color: "#EF4444", campaigns: 222 },
  { name: "Community", value: 15, color: "#F59E0B", campaigns: 185 },
  { name: "Environment", value: 10, color: "#8B5CF6", campaigns: 123 },
  { name: "Others", value: 7, color: "#6B7280", campaigns: 88 },
]

const topCampaigns = [
  {
    id: 1,
    title: "Build School in Rural Freetown",
    category: "Education",
    raised: 45000,
    goal: 50000,
    donors: 234,
    progress: 90,
    status: "Active",
  },
  {
    id: 2,
    title: "Medical Equipment for Hospital",
    category: "Healthcare",
    raised: 32000,
    goal: 35000,
    donors: 189,
    progress: 91,
    status: "Active",
  },
  {
    id: 3,
    title: "Clean Water Project",
    category: "Community",
    raised: 28000,
    goal: 30000,
    donors: 156,
    progress: 93,
    status: "Active",
  },
  {
    id: 4,
    title: "Emergency Food Relief",
    category: "Emergency",
    raised: 25000,
    goal: 25000,
    donors: 312,
    progress: 100,
    status: "Completed",
  },
  {
    id: 5,
    title: "Youth Sports Program",
    category: "Community",
    raised: 18000,
    goal: 20000,
    donors: 98,
    progress: 90,
    status: "Active",
  },
]

const fundingTrends = [
  { month: "Jan", amount: 125000, campaigns: 45 },
  { month: "Feb", amount: 142000, campaigns: 52 },
  { month: "Mar", amount: 138000, campaigns: 48 },
  { month: "Apr", amount: 165000, campaigns: 61 },
  { month: "May", amount: 158000, campaigns: 58 },
  { month: "Jun", amount: 182000, campaigns: 67 },
  { month: "Jul", amount: 195000, campaigns: 72 },
  { month: "Aug", amount: 188000, campaigns: 69 },
  { month: "Sep", amount: 205000, campaigns: 75 },
  { month: "Oct", amount: 218000, campaigns: 78 },
  { month: "Nov", amount: 232000, campaigns: 82 },
  { month: "Dec", amount: 245000, campaigns: 85 },
]

export default function AdminCampaignAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Analytics</h1>
          <p className="text-gray-600">Analyze campaign performance and funding trends</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {campaignStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="funding">Funding Trends</TabsTrigger>
          <TabsTrigger value="top-campaigns">Top Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Over Time</CardTitle>
              <CardDescription>Track campaign creation and success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="successful"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="failed"
                      stackId="3"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Rate Trends</CardTitle>
                <CardDescription>Monthly campaign success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={campaignPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          `${(((value as number) / (campaignPerformanceData.find((d) => d.month === name)?.created || 1)) * 100).toFixed(1)}%`,
                          "Success Rate",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="successful"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Status Distribution</CardTitle>
                <CardDescription>Current status of all campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Successful</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-900">789</p>
                      <p className="text-sm text-green-600">63.9%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Active</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">456</p>
                      <p className="text-sm text-blue-600">37.0%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-900">Failed</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-900">123</p>
                      <p className="text-sm text-red-600">10.0%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Categories</CardTitle>
                <CardDescription>Distribution of campaigns by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Number of campaigns per category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{category.campaigns}</p>
                        <p className="text-sm text-gray-500">{category.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funding Trends</CardTitle>
              <CardDescription>Total funding raised over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fundingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`Le ${(value as number).toLocaleString()}`, "Amount Raised"]} />
                    <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">Le 2.4M</p>
                <p className="text-sm text-gray-600">Total Raised This Year</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">Le 28.5K</p>
                <p className="text-sm text-gray-600">Average per Campaign</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">15.2K</p>
                <p className="text-sm text-gray-600">Total Donors</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="top-campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>Campaigns with highest funding and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{campaign.category}</span>
                          <span>•</span>
                          <span>{campaign.donors} donors</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      </div>
                      <p className="font-medium text-gray-900">
                        Le {campaign.raised.toLocaleString()} / Le {campaign.goal.toLocaleString()}
                      </p>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: `${campaign.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
