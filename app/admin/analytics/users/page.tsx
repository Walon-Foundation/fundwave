"use client"

import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import {
  Users,
  UserPlus,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
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

const userStats = [
  {
    title: "Total Users",
    value: "12,456",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "New Users (30d)",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: UserPlus,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Active Users",
    value: "8,901",
    change: "-2.1%",
    trend: "down",
    icon: Activity,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Verified Users",
    value: "6,789",
    change: "+5.3%",
    trend: "up",
    icon: UserCheck,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const userGrowthData = [
  { month: "Jan", users: 1200, newUsers: 120, activeUsers: 980 },
  { month: "Feb", users: 1450, newUsers: 250, activeUsers: 1180 },
  { month: "Mar", users: 1680, newUsers: 230, activeUsers: 1350 },
  { month: "Apr", users: 1920, newUsers: 240, activeUsers: 1520 },
  { month: "May", users: 2180, newUsers: 260, activeUsers: 1740 },
  { month: "Jun", users: 2450, newUsers: 270, activeUsers: 1960 },
  { month: "Jul", users: 2720, newUsers: 270, activeUsers: 2180 },
  { month: "Aug", users: 3000, newUsers: 280, activeUsers: 2400 },
  { month: "Sep", users: 3280, newUsers: 280, activeUsers: 2620 },
  { month: "Oct", users: 3580, newUsers: 300, activeUsers: 2860 },
  { month: "Nov", users: 3890, newUsers: 310, activeUsers: 3110 },
  { month: "Dec", users: 4200, newUsers: 310, activeUsers: 3360 },
]

const deviceData = [
  { name: "Mobile", value: 65, color: "#3B82F6" },
  { name: "Desktop", value: 28, color: "#10B981" },
  { name: "Tablet", value: 7, color: "#F59E0B" },
]

const locationData = [
  { country: "Sierra Leone", users: 8500, percentage: 68.2 },
  { country: "Guinea", users: 1200, percentage: 9.6 },
  { country: "Liberia", users: 980, percentage: 7.9 },
  { country: "Ghana", users: 650, percentage: 5.2 },
  { country: "Nigeria", users: 580, percentage: 4.7 },
  { country: "Others", users: 546, percentage: 4.4 },
]

const behaviorData = [
  { metric: "Avg. Session Duration", value: "4m 32s", change: "+12%" },
  { metric: "Pages per Session", value: "3.2", change: "+8%" },
  { metric: "Bounce Rate", value: "42.1%", change: "-5%" },
  { metric: "Return Visitor Rate", value: "68.4%", change: "+15%" },
]

export default function AdminUserAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
const [overview, setOverview] = useState<{ totalUsers: number; totalCampaigns: number; totalRaised: number; activeCampaigns: number;} | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  axiosInstance
    .get(`/api/admin/analytics?range=${timeRange}`)
    .then((res) => setOverview(res.data.overview))
    .catch((err) => console.error("Error fetching analytics:", err))
    .finally(() => setLoading(false));
}, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Analytics</h1>
          <p className="text-gray-600">Analyze user behavior and engagement patterns</p>
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
        {loading || !overview ? (
  <div>Loading statistics...</div>
) : (
  <>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{overview.totalUsers}</p>
          </div>
          <Users className="w-6 h-6 text-blue-600" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
            <p className="text-2xl font-bold text-gray-900">{overview.totalCampaigns}</p>
          </div>
          <Activity className="w-6 h-6 text-green-600" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Raised</p>
            <p className="text-2xl font-bold text-gray-900">{overview.totalRaised}</p>
          </div>
          <TrendingUp className="w-6 h-6 text-purple-600" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
            <p className="text-2xl font-bold text-gray-900">{overview.activeCampaigns}</p>
          </div>
          <UserCheck className="w-6 h-6 text-orange-600" />
        </div>
      </CardContent>
    </Card>
  </>
)}
      </div>

      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList>
          <TabsTrigger value="growth">User Growth</TabsTrigger>

          <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="devices">Devices & Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
              <CardDescription>Track user acquisition and retention trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
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
                <CardTitle>New User Registrations</CardTitle>
                <CardDescription>Monthly new user sign-ups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="newUsers" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Trends</CardTitle>
                <CardDescription>Active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="activeUsers" stroke="#8B5CF6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {behaviorData.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">{metric.metric}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center justify-center mt-2">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">{metric.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement Patterns</CardTitle>
              <CardDescription>How users interact with the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <MousePointer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">2.3M</p>
                    <p className="text-sm text-blue-600">Page Views</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">4m 32s</p>
                    <p className="text-sm text-green-600">Avg. Session</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">68.4%</p>
                    <p className="text-sm text-purple-600">Return Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics by Location</CardTitle>
              <CardDescription>Geographic distribution of users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationData.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{location.country}</p>
                        <p className="text-sm text-gray-500">{location.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{location.percentage}%</p>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>How users access the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
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
                <CardTitle>Platform Breakdown</CardTitle>
                <CardDescription>Detailed device and platform statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Mobile</p>
                        <p className="text-sm text-blue-600">iOS & Android</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">65%</p>
                      <p className="text-sm text-blue-600">8,096 users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Monitor className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Desktop</p>
                        <p className="text-sm text-green-600">Windows, Mac, Linux</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-900">28%</p>
                      <p className="text-sm text-green-600">3,488 users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-900">Tablet</p>
                        <p className="text-sm text-yellow-600">iPad & Android tablets</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-900">7%</p>
                      <p className="text-sm text-yellow-600">872 users</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
