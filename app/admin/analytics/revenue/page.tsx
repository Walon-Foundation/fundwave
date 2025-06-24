"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Download, Calendar } from "lucide-react"
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

const revenueStats = [
  {
    title: "Total Revenue",
    value: "Le 2,456,789",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Monthly Revenue",
    value: "Le 245,678",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Platform Fees",
    value: "Le 123,456",
    change: "+15.3%",
    trend: "up",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Net Revenue",
    value: "Le 2,333,333",
    change: "+11.8%",
    trend: "up",
    icon: Wallet,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
]

const monthlyRevenueData = [
  { month: "Jan", revenue: 185000, fees: 9250, net: 175750, transactions: 1250 },
  { month: "Feb", revenue: 198000, fees: 9900, net: 188100, transactions: 1340 },
  { month: "Mar", revenue: 212000, fees: 10600, net: 201400, transactions: 1420 },
  { month: "Apr", revenue: 225000, fees: 11250, net: 213750, transactions: 1580 },
  { month: "May", revenue: 238000, fees: 11900, net: 226100, transactions: 1650 },
  { month: "Jun", revenue: 252000, fees: 12600, net: 239400, transactions: 1720 },
  { month: "Jul", revenue: 265000, fees: 13250, net: 251750, transactions: 1890 },
  { month: "Aug", revenue: 278000, fees: 13900, net: 264100, transactions: 1950 },
  { month: "Sep", revenue: 291000, fees: 14550, net: 276450, transactions: 2100 },
  { month: "Oct", revenue: 304000, fees: 15200, net: 288800, transactions: 2250 },
  { month: "Nov", revenue: 318000, fees: 15900, net: 302100, transactions: 2380 },
  { month: "Dec", revenue: 332000, fees: 16600, net: 315400, transactions: 2450 },
]

const revenueSourcesData = [
  { name: "Platform Fees", value: 45, color: "#3B82F6", amount: 123456 },
  { name: "Premium Features", value: 25, color: "#10B981", amount: 68542 },
  { name: "Payment Processing", value: 20, color: "#F59E0B", amount: 54833 },
  { name: "Advertising", value: 7, color: "#8B5CF6", amount: 19192 },
  { name: "Partnerships", value: 3, color: "#EF4444", amount: 8225 },
]

const paymentMethodsData = [
  { method: "Mobile Money", revenue: 1234567, percentage: 50.2, transactions: 8950 },
  { method: "Bank Transfer", revenue: 789012, percentage: 32.1, transactions: 3420 },
  { method: "Credit Card", revenue: 345678, percentage: 14.1, transactions: 1890 },
  { method: "Cash", revenue: 87543, percentage: 3.6, transactions: 450 },
]

const topCampaignsByRevenue = [
  {
    id: 1,
    title: "Build School in Rural Freetown",
    revenue: 45000,
    fees: 2250,
    donors: 234,
    category: "Education",
  },
  {
    id: 2,
    title: "Medical Equipment for Hospital",
    revenue: 32000,
    fees: 1600,
    donors: 189,
    category: "Healthcare",
  },
  {
    id: 3,
    title: "Clean Water Project",
    revenue: 28000,
    fees: 1400,
    donors: 156,
    category: "Community",
  },
  {
    id: 4,
    title: "Emergency Food Relief",
    revenue: 25000,
    fees: 1250,
    donors: 312,
    category: "Emergency",
  },
  {
    id: 5,
    title: "Youth Sports Program",
    revenue: 18000,
    fees: 900,
    donors: 98,
    category: "Community",
  },
]

export default function AdminRevenueAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12m")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600">Track platform revenue and financial performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="2y">Last 2 years</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="sources">Revenue Sources</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="campaigns">Top Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue, fees, and net income over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`Le ${(value as number).toLocaleString()}`, ""]} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                      name="Total Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="fees"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Platform Fees"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Net Revenue Growth</CardTitle>
                <CardDescription>Net revenue after fees and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`Le ${(value as number).toLocaleString()}`, "Net Revenue"]} />
                      <Line type="monotone" dataKey="net" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Number of transactions per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="transactions" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>Breakdown of revenue by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueSourcesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {revenueSourcesData.map((entry, index) => (
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
                <CardTitle>Revenue Source Details</CardTitle>
                <CardDescription>Detailed breakdown with amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueSourcesData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: source.color }}></div>
                        <span className="font-medium text-gray-900">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Le {source.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{source.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Performance</CardTitle>
              <CardDescription>Revenue breakdown by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodsData.map((method, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{method.method}</h3>
                      <Badge variant="outline">{method.percentage}%</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-medium">Le {method.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Transactions</p>
                        <p className="font-medium">{method.transactions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Avg. Amount</p>
                        <p className="font-medium">
                          Le {Math.round(method.revenue / method.transactions).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${method.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Generating Campaigns</CardTitle>
              <CardDescription>Campaigns that generated the most platform revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCampaignsByRevenue.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
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
                      <p className="font-medium text-gray-900">Le {campaign.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Fees: Le {campaign.fees.toLocaleString()}</p>
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
