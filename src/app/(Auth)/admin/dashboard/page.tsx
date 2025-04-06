"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  Folder,
  Users,
  MessageSquare,
  DollarSign,
  Bell,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronDown,
  ChevronUp,
  Home,
  Eye,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define types for our data
interface Campaign {
  id: string
  title: string
  creator: string
  goal: number
  raised: number
  status: "Active" | "Completed"
  createdAt: string
}

interface User {
  id: string
  email: string
  campaignsCreated: number
  joinedAt: string
}

interface Comment {
  id: string
  campaignId: string
  campaignTitle: string
  userEmail: string
  text: string
  timestamp: string
}

interface Update {
  id: string
  campaignId: string
  campaignTitle: string
  userEmail: string
  text: string
  timestamp: string
}

// Placeholder data
const placeholderCampaigns: Campaign[] = [
  {
    id: "CAM001",
    title: "Clean Water Initiative",
    creator: "john.doe@example.com",
    goal: 5000,
    raised: 3500,
    status: "Active",
    createdAt: "2023-01-15T12:00:00Z",
  },
  {
    id: "CAM002",
    title: "Education for All",
    creator: "jane.smith@example.com",
    goal: 10000,
    raised: 7500,
    status: "Active",
    createdAt: "2023-02-20T12:00:00Z",
  },
  {
    id: "CAM003",
    title: "Green Energy Project",
    creator: "mark.wilson@example.com",
    goal: 15000,
    raised: 15000,
    status: "Completed",
    createdAt: "2023-03-10T12:00:00Z",
  },
  {
    id: "CAM004",
    title: "Animal Shelter Support",
    creator: "sarah.johnson@example.com",
    goal: 3000,
    raised: 1200,
    status: "Active",
    createdAt: "2023-03-25T12:00:00Z",
  },
  {
    id: "CAM005",
    title: "Tech for Schools",
    creator: "david.brown@example.com",
    goal: 8000,
    raised: 4200,
    status: "Active",
    createdAt: "2023-04-05T12:00:00Z",
  },
  {
    id: "CAM006",
    title: "Community Garden",
    creator: "lisa.taylor@example.com",
    goal: 2000,
    raised: 2000,
    status: "Completed",
    createdAt: "2023-04-15T12:00:00Z",
  },
  {
    id: "CAM007",
    title: "Homeless Support Fund",
    creator: "robert.miller@example.com",
    goal: 12000,
    raised: 6800,
    status: "Active",
    createdAt: "2023-04-22T12:00:00Z",
  },
  {
    id: "CAM008",
    title: "Medical Research",
    creator: "emily.clark@example.com",
    goal: 25000,
    raised: 18000,
    status: "Active",
    createdAt: "2023-05-01T12:00:00Z",
  },
  {
    id: "CAM009",
    title: "Arts & Culture Festival",
    creator: "michael.white@example.com",
    goal: 7500,
    raised: 3200,
    status: "Active",
    createdAt: "2023-05-10T12:00:00Z",
  },
  {
    id: "CAM010",
    title: "Disaster Relief",
    creator: "jennifer.lee@example.com",
    goal: 20000,
    raised: 20000,
    status: "Completed",
    createdAt: "2023-05-15T12:00:00Z",
  },
]

const placeholderUsers: User[] = [
  {
    id: "USR001",
    email: "john.doe@example.com",
    campaignsCreated: 2,
    joinedAt: "2023-01-01T12:00:00Z",
  },
  {
    id: "USR002",
    email: "jane.smith@example.com",
    campaignsCreated: 1,
    joinedAt: "2023-01-15T12:00:00Z",
  },
  {
    id: "USR003",
    email: "mark.wilson@example.com",
    campaignsCreated: 1,
    joinedAt: "2023-02-05T12:00:00Z",
  },
  {
    id: "USR004",
    email: "sarah.johnson@example.com",
    campaignsCreated: 1,
    joinedAt: "2023-03-10T12:00:00Z",
  },
  {
    id: "USR005",
    email: "david.brown@example.com",
    campaignsCreated: 5,
    joinedAt: "2023-03-20T12:00:00Z",
  },
]

const placeholderComments: Comment[] = [
  {
    id: "COM001",
    campaignId: "CAM001",
    campaignTitle: "Clean Water Initiative",
    userEmail: "user1@example.com",
    text: "This is an amazing initiative! I'm excited to see how it develops over time and the impact it will have.",
    timestamp: "2023-05-01T14:30:00Z",
  },
  {
    id: "COM002",
    campaignId: "CAM002",
    campaignTitle: "Education for All",
    userEmail: "user2@example.com",
    text: "I have some questions about the implementation. Can you provide more details about how the funds will be used?",
    timestamp: "2023-05-02T10:15:00Z",
  },
  {
    id: "COM003",
    campaignId: "CAM003",
    campaignTitle: "Green Energy Project",
    userEmail: "user3@example.com",
    text: "Great project! I'm interested in learning more about the technology being used.",
    timestamp: "2023-05-03T16:45:00Z",
  },
]

const placeholderUpdates: Update[] = [
  {
    id: "UPD001",
    campaignId: "CAM001",
    campaignTitle: "Clean Water Initiative",
    userEmail: "john.doe@example.com",
    text: "We've reached our first milestone! The first water well has been completed and is now operational.",
    timestamp: "2023-04-20T09:00:00Z",
  },
  {
    id: "UPD002",
    campaignId: "CAM002",
    campaignTitle: "Education for All",
    userEmail: "jane.smith@example.com",
    text: "We're excited to announce a new partnership with a local school to expand our reach and impact.",
    timestamp: "2023-04-25T11:30:00Z",
  },
  {
    id: "UPD003",
    campaignId: "CAM003",
    campaignTitle: "Green Energy Project",
    userEmail: "mark.wilson@example.com",
    text: "Project completed! All solar panels have been installed and are now generating clean energy.",
    timestamp: "2023-05-01T15:45:00Z",
  },
]

// Calculate stats
const totalCampaigns = placeholderCampaigns.length
const totalUsers = placeholderUsers.length
const totalComments = placeholderComments.length
const totalFundsRaised = placeholderCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0)
const activeCampaigns = placeholderCampaigns.filter((campaign) => campaign.status === "Active").length
const avgFundsPerCampaign = totalCampaigns > 0 ? totalFundsRaised / totalCampaigns : 0
const mostFundedCampaign = placeholderCampaigns.reduce((prev, current) =>
  prev.raised > current.raised ? prev : current,
)

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")

  const itemsPerPage = 5
  const totalPages = Math.ceil(placeholderCampaigns.length / itemsPerPage)

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Sort campaigns
  const sortedCampaigns = [...placeholderCampaigns].sort((a, b) => {
    if (!sortColumn) return 0

    let valueA
    let valueB

    switch (sortColumn) {
      case "id":
        valueA = a.id
        valueB = b.id
        break
      case "title":
        valueA = a.title
        valueB = b.title
        break
      case "creator":
        valueA = a.creator
        valueB = b.creator
        break
      case "goal":
        valueA = a.goal
        valueB = b.goal
        break
      case "raised":
        valueA = a.raised
        valueB = b.raised
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      case "createdAt":
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginate campaigns
  const paginatedCampaigns = sortedCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Filter users by search term
  const filteredUsers = placeholderUsers.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Sort indicator component
  const SortIndicator = ({ column }: { column: string }) => {
    if (sortColumn !== column) return null

    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="h-14 w-full justify-start bg-white border-b gap-2 px-4">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4"
              >
                <Home className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4"
              >
                <Folder className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="updates"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4"
              >
                <Bell className="h-4 w-4 mr-2" />
                Updates
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4"
              >
                <BarChart className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            {/* Main content */}
            <div className="container mx-auto p-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8 mt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Calendar className="h-4 w-4" />
                          This Month
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Today</DropdownMenuItem>
                        <DropdownMenuItem>This Week</DropdownMenuItem>
                        <DropdownMenuItem>This Month</DropdownMenuItem>
                        <DropdownMenuItem>This Year</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4">
                        <Folder className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-800">{totalCampaigns}</div>
                        <p className="text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12% from last month
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-800">{totalUsers}</div>
                        <p className="text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +8% from last month
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Comments</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-800">{totalComments}</div>
                        <p className="text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +15% from last month
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Total Funds Raised</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mr-4">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-800">${totalFundsRaised.toLocaleString()}</div>
                        <p className="text-xs text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +20% from last month
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Campaigns */}
                <Card className="border-none shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl text-gray-800">Recent Campaigns</CardTitle>
                      <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden border border-gray-100">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-50 hover:bg-blue-50">
                            <TableHead className="text-blue-600">Title</TableHead>
                            <TableHead className="text-blue-600">Creator</TableHead>
                            <TableHead className="text-blue-600">Status</TableHead>
                            <TableHead className="text-blue-600 text-right">Raised</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {placeholderCampaigns.slice(0, 5).map((campaign) => (
                            <TableRow key={campaign.id} className="hover:bg-blue-50/50">
                              <TableCell className="font-medium">{campaign.title}</TableCell>
                              <TableCell>{campaign.creator}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={campaign.status === "Active" ? "default" : "secondary"}
                                  className={
                                    campaign.status === "Active"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  }
                                >
                                  {campaign.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${campaign.raised.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Insights */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">Campaign Performance</CardTitle>
                      <CardDescription>Key metrics for all campaigns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 grid-cols-2">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
                          <p className="text-2xl font-bold text-gray-800">{activeCampaigns}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((activeCampaigns / totalCampaigns) * 100)}% of total
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">Average Funds per Campaign</h3>
                          <p className="text-2xl font-bold text-gray-800">
                            ${Math.round(avgFundsPerCampaign).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Based on {totalCampaigns} campaigns</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">Most Funded Campaign</h3>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800">{mostFundedCampaign.title}</p>
                            <p className="text-blue-600 font-bold">${mostFundedCampaign.raised.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">Recent Activity</CardTitle>
                      <CardDescription>Latest updates and comments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[...placeholderComments, ...placeholderUpdates]
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .slice(0, 4)
                          .map((item, index) => (
                            <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {"userEmail" in item ? item.userEmail.charAt(0).toUpperCase() : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-800">
                                    {"userEmail" in item ? item.userEmail : "Unknown"}
                                  </p>
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                    {"text" in item ? "Comment" : "Update"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{truncateText(item.text, 60)}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(item.timestamp)}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Campaigns Tab */}
              <TabsContent value="campaigns" className="space-y-6 mt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">All Campaigns</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">Add Campaign</Button>
                  </div>
                </div>

                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    {placeholderCampaigns.length > 0 ? (
                      <>
                        <div className="rounded-lg overflow-hidden border border-gray-100">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-blue-50 hover:bg-blue-50">
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600"
                                  onClick={() => handleSort("id")}
                                >
                                  ID <SortIndicator column="id" />
                                </TableHead>
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600"
                                  onClick={() => handleSort("title")}
                                >
                                  Title <SortIndicator column="title" />
                                </TableHead>
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600"
                                  onClick={() => handleSort("creator")}
                                >
                                  Creator <SortIndicator column="creator" />
                                </TableHead>
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600 text-right"
                                  onClick={() => handleSort("goal")}
                                >
                                  Goal ($) <SortIndicator column="goal" />
                                </TableHead>
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600 text-right"
                                  onClick={() => handleSort("raised")}
                                >
                                  Raised ($) <SortIndicator column="raised" />
                                </TableHead>
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600"
                                  onClick={() => handleSort("status")}
                                >
                                  Status <SortIndicator column="status" />
                                </TableHead>
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600"
                                  onClick={() => handleSort("createdAt")}
                                >
                                  Created At <SortIndicator column="createdAt" />
                                </TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedCampaigns.map((campaign) => (
                                <TableRow key={campaign.id} className="hover:bg-blue-50/50">
                                  <TableCell className="font-medium">{campaign.id}</TableCell>
                                  <TableCell>{campaign.title}</TableCell>
                                  <TableCell>{campaign.creator}</TableCell>
                                  <TableCell className="text-right">${campaign.goal.toLocaleString()}</TableCell>
                                  <TableCell className="text-right">${campaign.raised.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={campaign.status === "Active" ? "default" : "secondary"}
                                      className={
                                        campaign.status === "Active"
                                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                      }
                                    >
                                      {campaign.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View details</span>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, placeholderCampaigns.length)} of{" "}
                            {placeholderCampaigns.length} campaigns
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="ml-1">Previous</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <span className="mr-1">Next</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        <Folder className="h-8 w-8 mb-2 text-blue-300" />
                        <p>No campaigns yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6 mt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
                  <div className="flex items-center gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search by email..."
                        className="pl-8 border-blue-200 focus-visible:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Add User</Button>
                  </div>
                </div>

                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    {filteredUsers.length > 0 ? (
                      <div className="rounded-lg overflow-hidden border border-gray-100">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-blue-50 hover:bg-blue-50">
                              <TableHead>ID</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="text-center">Campaigns Created</TableHead>
                              <TableHead>Joined At</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow key={user.id} className="hover:bg-blue-50/50">
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-center">{user.campaignsCreated}</TableCell>
                                <TableCell>{formatDate(user.joinedAt)}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View details</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        <Users className="h-8 w-8 mb-2 text-blue-300" />
                        <p>No users found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="space-y-6 mt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Recent Comments</h2>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Comments
                  </Button>
                </div>

                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    {placeholderComments.length > 0 ? (
                      <div className="space-y-6">
                        {placeholderComments.map((comment) => (
                          <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Link
                                href={`/campaigns/${comment.campaignId}`}
                                className="font-medium text-blue-600 hover:underline"
                              >
                                {comment.campaignTitle}
                              </Link>
                              <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {comment.userEmail.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-blue-50 p-3 rounded-lg flex-1">
                                <p className="text-sm font-medium mb-1 text-gray-800">{comment.userEmail}</p>
                                <p className="text-sm text-gray-700">{comment.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        <MessageSquare className="h-8 w-8 mb-2 text-blue-300" />
                        <p>No comments yet</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 px-6 py-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">View All Comments</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Updates Tab */}
              <TabsContent value="updates" className="space-y-6 mt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Recent Updates</h2>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Updates
                  </Button>
                </div>

                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    {placeholderUpdates.length > 0 ? (
                      <div className="space-y-6">
                        {placeholderUpdates.map((update) => (
                          <div key={update.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Link
                                href={`/campaigns/${update.campaignId}`}
                                className="font-medium text-blue-600 hover:underline"
                              >
                                {update.campaignTitle}
                              </Link>
                              <span className="text-xs text-gray-500">{formatDate(update.timestamp)}</span>
                            </div>
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {update.userEmail.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-blue-50 p-3 rounded-lg flex-1">
                                <p className="text-sm font-medium mb-1 text-gray-800">{update.userEmail}</p>
                                <p className="text-sm text-gray-700">{update.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                        <Bell className="h-8 w-8 mb-2 text-blue-300" />
                        <p>No updates yet</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 px-6 py-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">View All Updates</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-6 mt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Campaign Insights</h2>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Calendar className="h-4 w-4" />
                          This Month
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Today</DropdownMenuItem>
                        <DropdownMenuItem>This Week</DropdownMenuItem>
                        <DropdownMenuItem>This Month</DropdownMenuItem>
                        <DropdownMenuItem>This Year</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">Campaign Performance</CardTitle>
                      <CardDescription>Key metrics for all campaigns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 grid-cols-2">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">Active Campaigns</h3>
                          <p className="text-2xl font-bold text-gray-800">{activeCampaigns}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((activeCampaigns / totalCampaigns) * 100)}% of total
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">Average Funds per Campaign</h3>
                          <p className="text-2xl font-bold text-gray-800">
                            ${Math.round(avgFundsPerCampaign).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Based on {totalCampaigns} campaigns</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Top Performing Campaigns</h3>
                        <div className="space-y-4">
                          {[...placeholderCampaigns]
                            .sort((a, b) => b.raised - a.raised)
                            .slice(0, 3)
                            .map((campaign, index) => (
                              <div key={campaign.id} className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate text-gray-800">{campaign.title}</p>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                      {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                                    </span>
                                    <span className="text-blue-600 font-medium">
                                      ${campaign.raised.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">User Statistics</CardTitle>
                      <CardDescription>User engagement and activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">Most Active Creator</h3>
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-blue-600 text-white">
                                {placeholderUsers
                                  .reduce((prev, current) =>
                                    prev.campaignsCreated > current.campaignsCreated ? prev : current,
                                  )
                                  .email.charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800">
                                {
                                  placeholderUsers.reduce((prev, current) =>
                                    prev.campaignsCreated > current.campaignsCreated ? prev : current,
                                  ).email
                                }
                              </p>
                              <p className="text-sm text-blue-600">
                                {
                                  placeholderUsers.reduce((prev, current) =>
                                    prev.campaignsCreated > current.campaignsCreated ? prev : current,
                                  ).campaignsCreated
                                }{" "}
                                campaigns
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500">Newest User</h3>
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-green-600 text-white">
                                {placeholderUsers
                                  .reduce((prev, current) =>
                                    new Date(prev.joinedAt) > new Date(current.joinedAt) ? prev : current,
                                  )
                                  .email.charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800">
                                {
                                  placeholderUsers.reduce((prev, current) =>
                                    new Date(prev.joinedAt) > new Date(current.joinedAt) ? prev : current,
                                  ).email
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                Joined{" "}
                                {formatDate(
                                  placeholderUsers.reduce((prev, current) =>
                                    new Date(prev.joinedAt) > new Date(current.joinedAt) ? prev : current,
                                  ).joinedAt,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

