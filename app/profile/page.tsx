"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Edit,
  Settings,
  Calendar,
  MapPin,
  Mail,
  Phone,
  TrendingUp,
  Heart,
  Target,
  ExternalLink,
  CheckCircle,
  Clock,
  Pause,
  X,
  Save,
  Camera,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { CombinedUserData } from "@/types/api"
import { api } from "@/lib/api/api"

export default function ProfilePage() {
  const [data, setData] = useState<CombinedUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    phone: "",
  })
  
  // Pagination states
  const [campaignsPage, setCampaignsPage] = useState(1)
  const [donationsPage, setDonationsPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const res = await api.getProfile()
        setData(res)
        // Initialize edit form with current data
        setEditForm({
          firstName: res.profile.firstName,
          lastName: res.profile.lastName,
          bio: res.profile.bio || "",
          location: res.profile.location || "",
          phone: res.profile.phone || "",
        })
      } catch (err) {
        console.error(err)
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCancelEdit = () => {
    if (data) {
      setEditForm({
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        bio: data.profile.bio || "",
        location: data.profile.location || "",
        phone: data.profile.phone || "",
      })
    }
    setIsEditing(false)
  }

  const handleDeleteAccount = () => {
    console.log("Account deletion requested")
    setShowDeleteConfirm(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-600" />
      case "cancelled":
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate paginated campaigns
  const paginatedCampaigns = data?.campaigns.slice(
    (campaignsPage - 1) * itemsPerPage,
    campaignsPage * itemsPerPage
  ) || []

  // Calculate paginated donations
  const paginatedDonations = data?.donations.slice(
    (donationsPage - 1) * itemsPerPage,
    donationsPage * itemsPerPage
  ) || []

  // Calculate total pages for campaigns
  const totalCampaignPages = data ? Math.ceil(data.campaigns.length / itemsPerPage) : 0

  // Calculate total pages for donations
  const totalDonationPages = data ? Math.ceil(data.donations.length / itemsPerPage) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Profile</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Profile Data</h2>
          <p className="text-slate-600 mb-6">Unable to load profile information.</p>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 flex-1">
              <div className="relative group">
                <Image
                  src={data.profile.profilePicture || "/placeholder.svg"}
                  alt={`${data.profile.firstName} ${data.profile.lastName}`}
                  width={100}
                  height={100}
                  className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-white shadow-2xl transition-transform group-hover:scale-105"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl sm:rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                )}
                {data.profile.isVerified && (
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg border-2 border-white">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center w-full">
                {isEditing ? (
                  <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, firstName: e.target.value }))}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, lastName: e.target.value }))}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Last Name"
                      />
                    </div>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Location"
                      />
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        {data.profile.firstName} {data.profile.lastName}
                      </h1>
                      {data.profile.isVerified && (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Verified</span>
                          <span className="sm:hidden">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4">@{data.profile.username}</p>

                    {data.profile.bio && (
                      <p className="text-sm sm:text-base text-slate-700 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
                        {data.profile.bio}
                      </p>
                    )}

                    <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                      <div className="flex items-center justify-center bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{data.profile.email}</span>
                      </div>
                      {data.profile.phone && (
                        <div className="flex items-center justify-center bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-green-500 flex-shrink-0" />
                          <span>{data.profile.phone}</span>
                        </div>
                      )}
                      {data.profile.location && (
                        <div className="flex items-center justify-center bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-red-500 flex-shrink-0" />
                          <span className="truncate">{data.profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-center bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3 text-purple-500 flex-shrink-0" />
                        <span>Joined {new Date(data.profile.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row sm:flex-col lg:flex-col gap-2 sm:gap-3 w-full sm:w-auto lg:w-48">
              {isEditing ? (
                <>
                  <button
                    // onClick={handleSaveProfile}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 min-h-[44px]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-base bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 font-medium min-h-[44px]"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 min-h-[44px]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 text-sm sm:text-base bg-white/50 backdrop-blur-sm text-slate-700 rounded-xl hover:bg-white/70 transition-all duration-300 font-medium border border-white/20 hover:scale-105 min-h-[44px]"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Go to Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                {data.stats.campaignsStarted}
              </div>
              <div className="text-slate-600 font-medium text-sm sm:text-base">Campaigns Started</div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                {data.stats.donationsMade}
              </div>
              <div className="text-slate-600 font-medium text-sm sm:text-base">Donations Made</div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2 leading-tight">
                {formatCurrency(data.stats.totalRaised)}
              </div>
              <div className="text-slate-600 font-medium text-sm sm:text-base">Total Raised</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* My Campaigns Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Campaigns
              </h2>
              <Link
                href="/create-campaign"
                className="text-blue-600 hover:text-purple-600 font-medium text-sm flex items-center transition-colors hover:scale-105 self-start sm:self-auto"
              >
                <span className="hidden sm:inline">Create New</span>
                <span className="sm:hidden">+ New</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {data.campaigns.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">No campaigns yet</h3>
                <p className="text-slate-500 mb-4 text-sm sm:text-base px-4">
                  Start your first campaign and make a difference in your community.
                </p>
                <Link
                  href="/create-campaign"
                  className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 min-h-[44px]"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  {paginatedCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border border-slate-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900 flex-1 pr-4">{campaign.title}</h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(campaign.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(campaign.status)}`}
                          >
                            {campaign.status}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span>{formatCurrency(campaign.amountRaised)} raised</span>
                          <span>{Math.round((campaign.amountRaised / campaign.targetAmount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${Math.round((campaign.amountRaised / campaign.targetAmount) * 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Goal: {formatCurrency(campaign.targetAmount)}</div>
                      </div>

                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-blue-600 hover:text-purple-600 text-sm font-medium transition-colors"
                      >
                        View Campaign →
                      </Link>
                    </div>
                  ))}
                </div>
                
                {/* Campaigns Pagination */}
                {totalCampaignPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setCampaignsPage(prev => Math.max(prev - 1, 1))}
                      disabled={campaignsPage === 1}
                      className="flex items-center px-3 py-1.5 text-sm bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    
                    <span className="text-sm text-slate-600">
                      Page {campaignsPage} of {totalCampaignPages}
                    </span>
                    
                    <button
                      onClick={() => setCampaignsPage(prev => Math.min(prev + 1, totalCampaignPages))}
                      disabled={campaignsPage === totalCampaignPages}
                      className="flex items-center px-3 py-1.5 text-sm bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* My Donations Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Donations
              </h2>
              <span className="text-xs sm:text-sm text-slate-600 bg-slate-100 px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto">
                {data.donations.length} donations
              </span>
            </div>

            {data.donations.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">No donations yet</h3>
                <p className="text-slate-500 mb-4 text-sm sm:text-base px-4">
                  Support amazing campaigns and help make a positive impact.
                </p>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 min-h-[44px]"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Campaigns
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  {paginatedDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-slate-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-slate-900 flex-1 pr-4">{donation.campaignTitle}</h3>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{formatCurrency(donation.amount)}</div>
                          <div className="text-xs text-slate-500">{new Date(donation.date).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {donation.message && <p className="text-sm text-slate-600 mb-2 italic">"{donation.message}"</p>}

                      <Link
                        href={`/campaigns/${donation.campaignId}`}
                        className="text-blue-600 hover:text-purple-600 text-sm font-medium transition-colors"
                      >
                        View Campaign →
                      </Link>
                    </div>
                  ))}
                </div>
                
                {/* Donations Pagination */}
                {totalDonationPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setDonationsPage(prev => Math.max(prev - 1, 1))}
                      disabled={donationsPage === 1}
                      className="flex items-center px-3 py-1.5 text-sm bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    
                    <span className="text-sm text-slate-600">
                      Page {donationsPage} of {totalDonationPages}
                    </span>
                    
                    <button
                      onClick={() => setDonationsPage(prev => Math.min(prev + 1, totalDonationPages))}
                      disabled={donationsPage === totalDonationPages}
                      className="flex items-center px-3 py-1.5 text-sm bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
                
                {data.donations.length > itemsPerPage && (
                  <div className="text-center pt-4">
                    <Link
                      href="/donations"
                      className="text-blue-600 hover:text-purple-600 font-medium text-sm transition-colors hover:scale-105 inline-block"
                    >
                      View All Donations →
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-red-200/50 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-3 sm:mb-4 flex items-center">
            <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Danger Zone
          </h2>
          <div className="bg-red-50/50 rounded-xl p-3 sm:p-4 border border-red-200/50">
            <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Delete Account</h3>
            <p className="text-red-700 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Once you delete your account, there is no going back. This will permanently delete your profile,
              campaigns, and all associated data.
            </p>

            {showDeleteConfirm ? (
              <div className="space-y-3">
                <p className="text-red-800 font-medium text-xs sm:text-sm">
                  Are you absolutely sure? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs sm:text-sm border border-red-300 min-h-[40px] sm:min-h-[44px]"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}