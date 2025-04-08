"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { selectAllCampaign } from "@/core/store/features/campaigns/campaignSlice"
import { selectAllComment } from "@/core/store/features/comments/commentSlice"
import { useAppSelector } from "@/core/hooks/storeHooks"
import { axiosInstance } from "@/core/api/axiosInstance"
import { selectAllUpdate } from "@/core/store/features/update/updateSlice"
import { formatDate } from "@/core/helpers/formatDate"
import { User } from "@/core/types/types"


export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<User[] | []>([])

  const allCampaigns = useAppSelector(selectAllCampaign)
  const allComments = useAppSelector(selectAllComment)
  const allUpdate = useAppSelector(selectAllUpdate)
  const totalFundsRaised = allCampaigns.reduce((sum, campaign) => sum + (campaign.moneyReceived ?? 0), 0)
  const activeCampaigns = allCampaigns.filter((campaign) => campaign.status === "Active").length
  const avgFundsPerCampaign = allCampaigns.length > 0 ? totalFundsRaised / allCampaigns.length : 0
  let mostFundedCampaign = null

  if (allCampaigns.length > 0) {
    mostFundedCampaign = allCampaigns.reduce((prev, current) =>
      (prev.moneyReceived ?? 0) > (current.moneyReceived ?? 0) ? prev : current,
    )
  }

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await axiosInstance.get("auth/users")
      if (response.status === 200) {
        setUser(response.data.data)
      }
    }
    getAllUsers()
  }, [])

  const itemsPerPage = 5
  const totalPages = Math.ceil(allCampaigns.length / itemsPerPage)

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
  const sortedCampaigns = [...allCampaigns].sort((a, b) => {
    if (!sortColumn) return 0

    let valueA: string | undefined | number
    let valueB: string | undefined | number

    switch (sortColumn) {
      case "id":
        valueA = a._id
        valueB = b._id
        break
      case "title":
        valueA = a.campaignName
        valueB = b.campaignName
        break
      case "creator":
        valueA = a.creatorName
        valueB = b.creatorName
        break
      case "goal":
        valueA = a.amountNeeded
        valueB = b.amountNeeded
        break
      case "raised":
        valueA = a.moneyReceived
        valueB = b.moneyReceived
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      case "createdAt":
        valueA = new Date(a.createdAt as string).getTime()
        valueB = new Date(b.createdAt as string).getTime()
        break
      default:
        return 0
    }

    if (valueA! < valueB!) return sortDirection === "asc" ? -1 : 1
    if (valueA! > valueB!) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginate campaigns
  const paginatedCampaigns = sortedCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Filter users by search term
  const filteredUsers = user.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

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

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Tabs - Desktop */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-16 w-full justify-start bg-white border-b gap-2 md:gap-4 px-4 md:px-6 overflow-x-auto no-scrollbar">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-3 md:px-5 py-2 transition-all whitespace-nowrap font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              >
                <Home className="h-5 w-5 mr-2" />
                <span className="inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="campaigns"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-3 md:px-5 py-2 transition-all whitespace-nowrap font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              >
                <Folder className="h-5 w-5 mr-2" />
                <span className="inline">Campaigns</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-3 md:px-5 py-2 transition-all whitespace-nowrap font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              >
                <Users className="h-5 w-5 mr-2" />
                <span className="inline">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-3 md:px-5 py-2 transition-all whitespace-nowrap font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="inline">Comments</span>
              </TabsTrigger>
              <TabsTrigger
                value="updates"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-3 md:px-5 py-2 transition-all whitespace-nowrap font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              >
                <Bell className="h-5 w-5 mr-2" />
                <span className="inline">Updates</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-3 md:px-5 py-2 transition-all whitespace-nowrap font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              >
                <BarChart className="h-5 w-5 mr-2" />
                <span className="inline">Insights</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8 mt-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <BarChart className="h-6 w-6 mr-2 text-blue-600" /> Dashboard Overview
                </h2>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 hidden md:flex">
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
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center p-4 pt-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mr-4 shadow-inner">
                      <Folder className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                        {allCampaigns?.length}
                      </div>
                      <p className="text-xs text-green-600 flex items-center font-medium mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% from last month
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center p-4 pt-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mr-4 shadow-inner">
                      <Users className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">{user.length}</div>
                      <p className="text-xs text-green-600 flex items-center font-medium mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8% from last month
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center p-4 pt-0">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mr-4 shadow-inner">
                      <MessageSquare className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                        {allComments?.length}
                      </div>
                      <p className="text-xs text-green-600 flex items-center font-medium mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15% from last month
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white overflow-hidden">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Funds Raised</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center p-4 pt-0">
                    <div>
                      <div className="text-xl md:text-3xl font-bold text-gray-800">NLe{totalFundsRaised}</div>
                      <p className="text-xs text-green-600 flex items-center font-medium mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +20% from last month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Campaigns */}
              <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
                <CardHeader className="pb-2 pt-5 px-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <Folder className="h-5 w-5 mr-2 text-blue-600" /> Recent Campaigns
                    </CardTitle>
                    <Button
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 font-medium"
                      onClick={() => handleTabChange("campaigns")}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-50/70 hover:bg-blue-50">
                            <TableHead className="text-blue-700 font-semibold">Title</TableHead>
                            <TableHead className="text-blue-700 font-semibold hidden md:table-cell">Creator</TableHead>
                            <TableHead className="text-blue-700 font-semibold">Status</TableHead>
                            <TableHead className="text-blue-700 font-semibold text-right">Raised</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allCampaigns.slice(0, 5).map((campaign) => (
                            <TableRow key={campaign._id} className="hover:bg-blue-50/50 transition-colors">
                              <TableCell className="font-medium">{campaign.campaignName}</TableCell>
                              <TableCell className="hidden md:table-cell">{campaign.creatorName}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={campaign.status === "Active" ? "default" : "secondary"}
                                  className={
                                    campaign.status === "Active"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100 font-medium"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-100 font-medium"
                                  }
                                >
                                  {campaign.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                NLe{campaign?.moneyReceived!.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Insights */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <CardHeader className="pt-5 pb-3">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" /> Campaign Performance
                    </CardTitle>
                    <CardDescription className="text-gray-500">Key metrics for all campaigns</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Active Campaigns</h3>
                        <p className="text-2xl font-bold text-gray-800 tracking-tight">{activeCampaigns}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((activeCampaigns / allCampaigns.length) * 100)}% of total
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-600">Average Funds per Campaign</h3>
                        <p className="text-2xl font-bold text-gray-800 tracking-tight">
                          NLe{Math.round(avgFundsPerCampaign).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Based on {allCampaigns.length} campaigns</p>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-600 mb-4">Most Funded Campaign</h3>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800">{mostFundedCampaign?.campaignName}</p>
                          <p className="text-blue-600 font-bold">
                            NLe{mostFundedCampaign?.moneyReceived!.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-blue-600" /> Recent Activity
                    </CardTitle>
                    <CardDescription>Latest updates and comments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...allComments, ...allUpdate]
                        .sort(
                          (a, b) =>
                            new Date(b?.createdAt as string).getTime() - new Date(a?.createdAt as string).getTime(),
                        )
                        .slice(0, 4)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-blue-50/30 p-2 rounded-md transition-colors"
                          >
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-blue-600 text-white font-medium">
                                {"userEmail" in item ? item?.campaignName?.charAt(0).toUpperCase() : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-800">
                                  {"userEmail" in item ? item?.campaignName : "Unknown"}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-blue-50 text-blue-600 border-blue-200 font-medium ml-1"
                                >
                                  {"text" in item ? "Comment" : "Update"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {truncateText(item?.description, 60)}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{formatDate(item?.createdAt as string)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div className="space-y-6 mt-2 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Folder className="h-6 w-6 mr-2 text-blue-600" /> All Campaigns
                </h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <Button
                    variant="outline"
                    className="gap-2 w-full md:w-auto border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto font-medium shadow-md">
                    Add Campaign
                  </Button>
                </div>
              </div>

              <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  {allCampaigns.length > 0 ? (
                    <>
                      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-blue-50/70 hover:bg-blue-50">
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
                                  className="cursor-pointer hover:text-blue-600 hidden md:table-cell"
                                  onClick={() => handleSort("creator")}
                                >
                                  Creator <SortIndicator column="creator" />
                                </TableHead>
                                <TableHead
                                  className="cursor-pointer hover:text-blue-600 text-right hidden md:table-cell"
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
                                  className="cursor-pointer hover:text-blue-600 hidden md:table-cell"
                                  onClick={() => handleSort("createdAt")}
                                >
                                  Created At <SortIndicator column="createdAt" />
                                </TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedCampaigns.map((campaign) => (
                                <TableRow key={campaign._id} className="hover:bg-blue-50/50 transition-colors">
                                  <TableCell className="font-medium">{campaign._id?.slice(0, 4)}</TableCell>
                                  <TableCell>{campaign.campaignName}</TableCell>
                                  <TableCell className="hidden md:table-cell">{campaign.creatorName}</TableCell>
                                  <TableCell className="text-right hidden md:table-cell">
                                    NLe{campaign?.amountNeeded.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    NLe{campaign?.moneyReceived!.toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={campaign.status === "Active" ? "default" : "secondary"}
                                      className={
                                        campaign.status === "Active"
                                          ? "bg-green-100 text-green-800 hover:bg-green-100 font-medium"
                                          : "bg-blue-100 text-blue-800 hover:bg-blue-100 font-medium"
                                      }
                                    >
                                      {campaign.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    {formatDate(campaign.createdAt as string)}
                                  </TableCell>
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
                      </div>

                      {/* Pagination */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 gap-4">
                        <div className="text-sm text-gray-600 order-2 md:order-1 text-center md:text-left">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                          {Math.min(currentPage * itemsPerPage, allCampaigns.length)} of{" "}
                          {allCampaigns.length} campaigns
                        </div>
                        <div className="flex items-center justify-center md:justify-end space-x-2 order-1 md:order-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium shadow-sm"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="ml-1">Previous</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium shadow-sm"
                          >
                            <span className="mr-1">Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-300 p-8">
                      <Folder className="h-12 w-12 mb-4 text-blue-300 opacity-70" />
                      <p className="text-gray-600 font-medium">No campaigns yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6 mt-2 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-600" /> All Users
                </h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search by email..."
                      className="pl-9 h-10 border-blue-200 focus-visible:ring-blue-500 w-full shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto font-medium shadow-md">
                    Add User
                  </Button>
                </div>
              </div>

              <Card className="border-none shadow-lg overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  {filteredUsers.length > 0 ? (
                    <div className="rounded-lg overflow-hidden border border-gray-100">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-blue-50 hover:bg-blue-50">
                              <TableHead>ID</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="text-center">Campaigns</TableHead>
                              <TableHead className="hidden md:table-cell">Joined At</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow key={user._id} className="hover:bg-blue-50/50">
                                <TableCell className="font-medium">{user._id?.slice(0,6)}...</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-center">{user?.campaigns?.length}</TableCell>
                                <TableCell className="hidden md:table-cell">{formatDate(user.createdAt as string)}</TableCell>
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
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <Users className="h-8 w-8 mb-2 text-blue-300" />
                      <p>No users found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-6 mt-2 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-blue-600" /> Recent Comments
                </h2>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Comments
                </Button>
              </div>

              <Card className="border-none shadow-lg">
                <CardContent className="p-4 md:p-6">
                  {allComments.length > 0 ? (
                    <div className="space-y-6">
                      {allComments?.map((comment) => (
                        <div
                          key={comment._id}
                          className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 hover:bg-blue-50/30 p-3 rounded-md -mx-3 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={`/campaign/${comment.campaignId}`}
                              className="font-medium text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                            >
                              {comment.campaignName}
                            </Link>
                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt as string)}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {comment?.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-blue-50 p-4 rounded-lg flex-1 shadow-sm border border-blue-100">
                              <p className="text-sm font-medium mb-1 text-gray-800">{comment?.username}</p>
                              <p className="text-sm text-gray-700">{comment?.description}</p>
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
                <CardFooter className="border-t border-gray-100 px-6 py-5 bg-gray-50/50">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 font-medium shadow-md">
                    View All Comments
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Updates Tab */}
          {activeTab === "updates" && (
            <div className="space-y-6 mt-2 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Bell className="h-6 w-6 mr-2 text-blue-600" /> Recent Updates
                </h2>
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Updates
                </Button>
              </div>

              <Card className="border-none shadow-lg">
                <CardContent className="p-4 md:p-6">
                  {allUpdate.length > 0 ? (
                    <div className="space-y-6">
                      {allUpdate.map((update) => (
                        <div key={update._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={`/campaigns/${update.campaignId}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {update.campaignName}
                            </Link>
                            <span className="text-xs text-gray-500">{formatDate(update.createdAt as string)}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {update.campaignName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-blue-50 p-3 rounded-lg flex-1">
                              <p className="text-sm font-medium mb-1 text-gray-800">{update.campaignName}</p>
                              <p className="text-sm text-gray-700">{update.title}</p>
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
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === "insights" && (
            <div className="space-y-6 mt-2 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <BarChart className="h-6 w-6 mr-2 text-blue-600" /> Campaign Insights
                </h2>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 w-full md:w-auto">
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
                          {Math.round((activeCampaigns / allCampaigns.length) * 100)}% of total
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Average Funds per Campaign</h3>
                        <p className="text-2xl font-bold text-gray-800">
                          NLe{Math.round(avgFundsPerCampaign).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Based on {allCampaigns.length} campaigns</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Top Performing Campaigns</h3>
                      <div className="space-y-4">
                        {[...allCampaigns]
                          .sort((a, b) => b.moneyReceived! - a.moneyReceived!)
                          .slice(0, 3)
                          .map((campaign, index) => (
                            <div key={campaign._id} className="flex items-center">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-gray-800">{campaign.campaignName}</p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">
                                    {Math.round(((campaign.moneyReceived ?? 0 ) / campaign.amountNeeded) * 100)}% funded
                                  </span>
                                  <span className="text-blue-600 font-medium">NLe{campaign.moneyReceived?.toLocaleString()}</span>
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
                    <div className="grid gap-4 md:grid-cols-1">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Most Active Creator</h3>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className="bg-blue-600 text-white">
                              {user
                                .reduce((prev, current) =>
                                  (prev.campaigns ?? 0) > (current.campaigns ?? 0) ? prev : current,
                                )
                                .email.charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">
                              {
                                user.reduce((prev, current) =>
                                  (prev.campaigns ?? 0) > (current.campaigns ?? 0)  ? prev : current,
                                ).email
                              }
                            </p>
                            <p className="text-sm text-blue-600">
                              {
                                user.reduce((prev, current) =>
                                  (prev.campaigns ?? 0) > (current.campaigns ?? 0)  ? prev : current,
                                ).campaigns?.length
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
                              {user
                                .reduce((prev, current) =>
                                  new Date(prev.createdAt as string) > new Date(current.createdAt as string) ? prev : current,
                                )
                                .email.charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">
                              {
                                user.reduce((prev, current) =>
                                  new Date(prev.createdAt as string) > new Date(current.createdAt as string) ? prev : current,
                                ).email
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              Joined{" "}
                              {formatDate(
                                user.reduce((prev, current) =>
                                  new Date(prev.createdAt as string) > new Date(current.createdAt as string) ? prev : current,
                                ).createdAt,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
