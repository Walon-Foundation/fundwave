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
  BarChart3,
  Share2,
  Download,
  Bell,
  Target,
  Pause,
  Play,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
// import DashboardSetupWizard from "@/components/dashboard-setup-wizard"
import { Dashboard } from "@/types/api"
import { api } from "@/lib/api/api"

export default function CreatorDashboard() {
  const [data, setData] = useState<Dashboard>()
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [loading, setLoading] = useState(true)

  // Pagination states for each section
  const [campaignsPage, setCampaignsPage] = useState(1)
  const [notificationsPage, setNotificationsPage] = useState(1)
  const [activityPage, setActivityPage] = useState(1)
  const [campaignsPerPage] = useState(5)
  const [notificationsPerPage] = useState(8)
  const [activityPerPage] = useState(5)

  const { user } = useUser()

  useEffect(() => {
    if (!user) return

    const getData = async () => {
      try {
        setLoading(true)
        const res = await api.getUserDashboard()
        setData(res)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    getData()

    // Check if this is user's first time on dashboard
    const hasSeenDashboard = localStorage.getItem("hasSeenDashboard")
    if (!hasSeenDashboard) {
      setIsFirstTime(true)
      localStorage.setItem("hasSeenDashboard", "true")
    }
  }, [user])

  // Calculate pagination values
  const campaignsTotalPages = data ? Math.ceil(data?.campaigns?.length / campaignsPerPage) : 1
  const notificationsTotalPages = data ? Math.ceil(data?.notifications?.length / notificationsPerPage) : 1
  const activityTotalPages = data ? Math.ceil(data?.notifications?.length / activityPerPage) : 1

  // Get current items for each section
  const indexOfLastCampaign = campaignsPage * campaignsPerPage
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage
  const currentCampaigns = data ? data?.campaigns?.slice(indexOfFirstCampaign, indexOfLastCampaign) : []

  const indexOfLastNotification = notificationsPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = data ? data?.notifications?.slice(indexOfFirstNotification, indexOfLastNotification) : []

  const indexOfLastActivity = activityPage * activityPerPage
  const indexOfFirstActivity = indexOfLastActivity - activityPerPage
  const currentActivity = data ? data?.notifications?.slice(indexOfFirstActivity, indexOfLastActivity) : []

  // Change page functions
  const paginateCampaigns = (pageNumber: number) => setCampaignsPage(pageNumber)
  const paginateNotifications = (pageNumber: number) => setNotificationsPage(pageNumber)
  const paginateActivity = (pageNumber: number) => setActivityPage(pageNumber)

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
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const handleCampaignAction = (campaignId: string, action: string) => {
    console.log(`${action} campaign ${campaignId}`)
    // Implement campaign actions
  }

  const calculateDaysLeft = (endDate: Date) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Pagination component
  const Pagination = ({ currentPage, totalPages, paginate }: { currentPage: number, totalPages: number, paginate: (page: number) => void }) => {
    const pageNumbers = []
    
    // Show up to 5 page numbers with current page in the middle
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, startPage + 4)
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex items-center justify-center mt-6 space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className={`px-3 py-1 rounded-lg ${1 === currentPage ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-slate-400">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded-lg ${number === currentPage ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
            <button
              onClick={() => paginate(totalPages)}
              className={`px-3 py-1 rounded-lg ${totalPages === currentPage ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Loading Dashboard...</h1>
          <p className="text-slate-600">Please wait while we load your data</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Data Available</h1>
          <p className="text-slate-600">We couldn't load your dashboard data</p>
          <Link href="/create-campaign" className="btn-primary mt-4 inline-flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Campaign
          </Link>
        </div>
      </div>
    )
  }

  const selectedCampaignData = data.campaigns?.find((c) => c.id === selectedCampaign)
  const activeCampaigns = data.campaigns?.filter(c => c.status === "active")?.length
  const totalCampaigns = data.campaigns?.length

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">Creator Dashboard</h1>
            <p className="text-lg sm:text-xl text-slate-600">Manage your campaigns and track your impact</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-slate-600 cursor-pointer" />
              {data?.notifications?.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {data?.notifications?.filter((n) => !n.read)?.length}
                </span>
              )}
            </div>
            <Link href="/create-campaign" className="btn-primary flex items-center create-campaign-btn">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 stats-overview">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Total Raised</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900 truncate">
                  {typeof data.totalRaised === 'number' ? formatCurrency(data.totalRaised) : data.totalRaised || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-600">Across all campaigns</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Total Donors</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">{data.totalDonors || 0}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-600">Unique donors</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Active Campaigns</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">{activeCampaigns || 0}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-600">{totalCampaigns || 0} total campaigns</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">Coming soon</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-600">Feature in development</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6 dashboard-tabs">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            {["overview", "campaigns", "analytics", "notifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab}
                {tab === "notifications" && data?.notifications?.filter((n) => !n.read).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {data?.notifications?.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="card mb-6 recent-activity">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Recent Activity</h2>
                  <span className="text-sm text-slate-500">
                    Page {activityPage} of {activityTotalPages}
                  </span>
                </div>
                {currentActivity?.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {currentActivity?.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                                notification.type === "donations"
                                  ? "bg-green-100"
                                  : notification.type === "comment"
                                    ? "bg-blue-100"
                                    : "bg-slate-100"
                              }`}
                            >
                              {notification.type === "donations" && <DollarSign className="w-4 h-4 text-green-600" />}
                              {notification.type === "comment" && <MessageCircle className="w-4 h-4 text-blue-600" />}
                              {notification.type === "update" && <Bell className="w-4 h-4 text-slate-600" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-slate-900 text-sm sm:text-base">{notification.title}</p>
                              <p className="text-xs sm:text-sm text-slate-500">
                                {new Date(notification.createdAt)?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {!notification.read && (
                            <span className="text-xs sm:text-sm text-slate-500 ml-2 flex-shrink-0">New</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {activityTotalPages > 1 && (
                      <Pagination 
                        currentPage={activityPage} 
                        totalPages={activityTotalPages} 
                        paginate={paginateActivity} 
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No recent activity</p>
                  </div>
                )}
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
                    <p className="text-xs text-blue-600">Regular updates increase donor engagement</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">Share on social media</p>
                    <p className="text-xs text-green-600">Social sharing can expand your reach</p>
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
            {data?.campaigns?.length > 0 ? (
              <div className="card campaigns-table">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Your Campaigns</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Showing {Math.min(campaignsPerPage, currentCampaigns?.length)} of {data.campaigns?.length} campaigns
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option>All Campaigns</option>
                      <option>Active</option>
                      <option>Completed</option>
                    </select>
                    <button className="btn-outline flex items-center justify-center">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="hidden lg:block overflow-x-auto">
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
                      {currentCampaigns?.map((campaign) => {
                        const progress = (campaign.donated / campaign.amountNeeded) * 100
                        const daysLeft = calculateDaysLeft(campaign.endDate)
                        return (
                          <tr key={campaign.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-1">{campaign.name}</h3>
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
                                  <span>{formatCurrency(campaign.donated)}</span>
                                  <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                  />
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  Goal: {formatCurrency(campaign.amountNeeded)}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm space-y-1">
                                <div className="flex items-center">
                                  <Users className="w-3 h-3 mr-1 text-slate-400" />
                                  <span>{campaign.totalDonors} donors</span>
                                </div>
                                <div className="flex items-center">
                                  <MessageCircle className="w-3 h-3 mr-1 text-slate-400" />
                                  <span>{campaign.totalComments} comments</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                {campaign.status === "completed" ? (
                                  <span className="text-green-600 font-medium">Completed</span>
                                ) : daysLeft > 0 ? (
                                  <div>
                                    <div className="font-medium text-slate-900">{daysLeft} days</div>
                                    <div className="text-slate-500">remaining</div>
                                  </div>
                                ) : (
                                  <span className="text-red-600 font-medium">Expired</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Link
                                  href={`/campaigns/${campaign.id}`}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                                >
                                  View
                                </Link>
                                <Link
                                  href={`/campaigns/${campaign.id}/edit`}
                                  className="text-slate-600 hover:text-slate-800 text-sm"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                {/* Add Update Button */}
                                <Link
                                  href={`/campaigns/${campaign.id}/updates`}
                                  className="text-slate-600 hover:text-slate-800"
                                  title="Add Update"
                                >
                                  <FileText className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() =>
                                    handleCampaignAction(campaign.id, campaign.status === "active" ? "pause" : "resume")
                                  }
                                  className="text-slate-600 hover:text-slate-800"
                                >
                                  {campaign.status === "active" ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {campaignsTotalPages > 1 && (
                    <Pagination 
                      currentPage={campaignsPage} 
                      totalPages={campaignsTotalPages} 
                      paginate={paginateCampaigns} 
                    />
                  )}
                </div>

                <div className="lg:hidden space-y-4">
                  {currentCampaigns?.map((campaign) => {
                    const progress = (campaign.donated / campaign.amountNeeded) * 100
                    const daysLeft = calculateDaysLeft(campaign.endDate)
                    return (
                      <div key={campaign.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 mb-1 truncate">{campaign.name}</h3>
                            <p className="text-sm text-slate-600">
                              Created {new Date(campaign.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(campaign.status)}`}
                          >
                            {campaign.status}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>{formatCurrency(campaign.donated)}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Goal: {formatCurrency(campaign.amountNeeded)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1 text-slate-400" />
                            <span>{campaign.totalDonors} donors</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1 text-slate-400" />
                            <span>{campaign.totalComments} comments</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            {campaign.status === "completed" ? (
                              <span className="text-green-600 font-medium">Completed</span>
                            ) : daysLeft > 0 ? (
                              <span className="text-slate-900 font-medium">{daysLeft} days left</span>
                            ) : (
                              <span className="text-red-600 font-medium">Expired</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/campaigns/${campaign.id}`}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              View
                            </Link>
                            <Link
                              href={`/campaigns/${campaign.id}/edit`}
                              className="text-slate-600 hover:text-slate-800 text-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            {/* Add Update Button for mobile view */}
                            <Link
                              href={`/campaigns/${campaign.id}/update`}
                              className="text-slate-600 hover:text-slate-800"
                              title="Add Update"
                            >
                              <FileText className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleCampaignAction(campaign.id, campaign.status === "active" ? "pause" : "resume")
                              }
                              className="text-slate-600 hover:text-slate-800"
                            >
                              {campaign.status === "active" ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {campaignsTotalPages > 1 && (
                    <Pagination 
                      currentPage={campaignsPage} 
                      totalPages={campaignsTotalPages} 
                      paginate={paginateCampaigns} 
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">No Campaigns Yet</h3>
                <p className="text-slate-600 mb-6">You haven't created any campaigns yet</p>
                <Link href="/create-campaign" className="btn-primary inline-flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-section">
            {data?.campaigns?.length > 0 ? (
              <>
                {/* Campaign Selector */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <select
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {data?.campaigns?.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
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
                  <button className="btn-outline flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </button>
                </div>

                {selectedCampaignData ? (
                  <div className="card text-center py-12">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-slate-600 mb-6">
                      We're working on detailed analytics for your campaign: {selectedCampaignData.name}
                    </p>
                    <div className="flex justify-center gap-4">
                      <button className="btn-outline">Learn More</button>
                      <button className="btn-primary">Get Notified</button>
                    </div>
                  </div>
                ) : (
                  <div className="card text-center py-12">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Select a Campaign</h3>
                    <p className="text-slate-600">Choose a campaign to view its analytics</p>
                  </div>
                )}
              </>
            ) : (
              <div className="card text-center py-12">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">No Campaigns Yet</h3>
                <p className="text-slate-600 mb-6">Create a campaign to view analytics</p>
                <Link href="/create-campaign" className="btn-primary inline-flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="card notifications-section">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Notifications</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Showing {Math.min(notificationsPerPage, currentNotifications?.length)} of {data?.notifications?.length} notifications
                </p>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">Mark all as read</button>
            </div>

            {currentNotifications?.length > 0 ? (
              <>
                <div className="space-y-4">
                  {currentNotifications?.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? "bg-white border-slate-200" : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start min-w-0 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                              notification.type === "donations"
                                ? "bg-green-100"
                                : notification.type === "comment"
                                  ? "bg-blue-100"
                                  : "bg-slate-100"
                            }`}
                          >
                            {notification.type === "donations" && <DollarSign className="w-4 h-4 text-green-600" />}
                            {notification.type === "comment" && <MessageCircle className="w-4 h-4 text-blue-600" />}
                            {notification.type === "update" && <Bell className="w-4 h-4 text-slate-600" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-slate-900 text-sm sm:text-base">{notification.title}</p>
                            <p className="text-xs sm:text-sm text-slate-500">
                              {new Date(notification.createdAt)?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {notificationsTotalPages > 1 && (
                  <Pagination 
                    currentPage={notificationsPage} 
                    totalPages={notificationsTotalPages} 
                    paginate={paginateNotifications} 
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Notifications</h3>
                <p className="text-slate-600">You don't have any notifications yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}