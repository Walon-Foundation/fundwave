"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Edit,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  Share2,
  Download,
  Target,
  CheckCircle,
  Star,
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { axiosInstance } from "@/lib/axiosInstance"

// Enhanced mock user data
const mockUser = {
  id: "1",
  firstName: "Aminata",
  lastName: "Kamara",
  email: "aminata.kamara@email.com",
  phone: "+232 76 123 456",
  location: "Freetown, Western Area",
  avatar: "/placeholder.svg?height=100&width=100",
  joinDate: "2024-01-15",
  kycStatus: "approved",
  totalDonated: 750000,
  campaignsSupported: 12,
  campaignsCreated: 2,
  totalRaised: 7500000,
  impactScore: 85,
  badges: ["Early Supporter", "Community Champion", "Verified Creator"],
  socialLinks: {
    facebook: "aminata.kamara",
    twitter: "@aminata_k",
    linkedin: "aminata-kamara",
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    publicProfile: true,
    showDonations: false,
  },
  stats: {
    totalViews: 15420,
    totalShares: 234,
    avgDonation: 62500,
    successRate: 95,
    responseTime: "2 hours",
  },
}

const mockDonations = [
  {
    id: "1",
    campaignTitle: "Clean Water for Makeni Community",
    campaignId: "1",
    amount: 100000,
    date: "2024-01-20",
    status: "completed",
    anonymous: false,
    message: "Great cause! Hope this helps.",
    impact: "Helped provide clean water to 50 families",
  },
  {
    id: "2",
    campaignTitle: "Solar Power for Rural School",
    campaignId: "2",
    amount: 250000,
    date: "2024-01-18",
    status: "completed",
    anonymous: true,
    message: "",
    impact: "Contributed to solar panel installation",
  },
  {
    id: "3",
    campaignTitle: "Medical Equipment for Hospital",
    campaignId: "3",
    amount: 400000,
    date: "2024-01-15",
    status: "completed",
    anonymous: false,
    message: "Healthcare is so important for our communities.",
    impact: "Helped purchase essential medical equipment",
  },
]

const mockCreatedCampaigns = [
  {
    id: "1",
    title: "Clean Water for Makeni Community",
    status: "active",
    raised: 2500000,
    target: 5000000,
    donors: 45,
    progress: 50,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Youth Skills Training Center",
    status: "active",
    raised: 3100000,
    target: 6000000,
    donors: 56,
    progress: 52,
    createdAt: "2024-01-10",
  },
]

const mockAchievements = [
  { id: "1", title: "First Donation", description: "Made your first donation", date: "2024-01-15", icon: "🎉" },
  { id: "2", title: "Community Champion", description: "Supported 10+ campaigns", date: "2024-01-18", icon: "🏆" },
  { id: "3", title: "Generous Giver", description: "Donated over SLL 500,000", date: "2024-01-20", icon: "💝" },
  { id: "4", title: "Campaign Creator", description: "Created your first campaign", date: "2024-01-15", icon: "🚀" },
]

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [realUser, setRealUser] = useState({})

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const { user:clerkUser } = useUser()
  

  //getting the user from the database
  useEffect(() => {
    if(!clerkUser)return

    const fetchUser = async() => {
      try{
        const res = await axiosInstance.get("/users/profile")
        if(res.status === 200){
          setRealUser(res.data.data)
          console.log(res.data.data)
        }
      }catch(err){
        console.log(err)
      }
    }

    fetchUser()
  }, [clerkUser])

  const handleSaveProfile = () => {
    console.log("Saving profile:", user)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="card mb-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700">
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        className="input text-sm"
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                      />
                      <input
                        type="text"
                        className="input text-sm"
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h2>
                    <div className="flex items-center justify-center mt-2 space-x-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.kycStatus === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.kycStatus === "approved" ? "✓ Verified" : "Pending Verification"}
                      </div>
                      <div className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {user.impactScore}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center text-slate-600">
                  <Mail className="w-4 h-4 mr-3" />
                  {isEditing ? (
                    <input
                      type="email"
                      className="input text-sm flex-1"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>

                <div className="flex items-center text-slate-600">
                  <Phone className="w-4 h-4 mr-3" />
                  {isEditing ? (
                    <input
                      type="tel"
                      className="input text-sm flex-1"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </div>

                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-3" />
                  {isEditing ? (
                    <input
                      type="text"
                      className="input text-sm flex-1"
                      value={user.location}
                      onChange={(e) => setUser({ ...user, location: e.target.value })}
                    />
                  ) : (
                    <span>{user.location}</span>
                  )}
                </div>

                <div className="flex items-center text-slate-600">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button onClick={handleSaveProfile} className="btn-primary flex-1 text-sm">
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn-outline flex-1 text-sm">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-outline w-full flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}

                <Link href="/kyc" className="btn-secondary w-full flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Link>

                <button className="btn-outline w-full flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Impact Score</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${user.impactScore}%` }} />
                    </div>
                    <span className="text-sm font-medium">{user.impactScore}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Success Rate</span>
                  <span className="font-semibold text-slate-900">{user.stats.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Avg Response</span>
                  <span className="font-semibold text-slate-900">{user.stats.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Views</span>
                  <span className="font-semibold text-slate-900">{user.stats.totalViews.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Enhanced Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="card text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(user.totalDonated)}</div>
                <div className="text-sm text-slate-600">Total Donated</div>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{user.campaignsSupported}</div>
                <div className="text-sm text-slate-600">Campaigns Supported</div>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(user.totalRaised)}</div>
                <div className="text-sm text-slate-600">Total Raised</div>
              </div>

              <div className="card text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{user.campaignsCreated}</div>
                <div className="text-sm text-slate-600">Campaigns Created</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
              <nav className="flex space-x-8">
                {["overview", "donations", "campaigns", "achievements", "settings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {mockDonations.slice(0, 5).map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-slate-900 font-medium">Donated {formatCurrency(donation.amount)}</p>
                            <p className="text-sm text-slate-600">{donation.campaignTitle}</p>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">{new Date(donation.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Summary */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Impact</h3>
                  <div className="space-y-4">
                    {mockDonations.slice(0, 3).map((donation) => (
                      <div key={donation.id} className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm font-medium text-slate-900">{donation.campaignTitle}</p>
                        <p className="text-xs text-slate-600 mt-1">{donation.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "donations" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-900">Your Donations</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">{mockDonations.length} donations</span>
                    <button className="btn-outline flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {mockDonations.map((donation) => (
                  <div key={donation.id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{donation.campaignTitle}</h4>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-slate-900">
                              {formatCurrency(donation.amount)}
                            </div>
                            <div
                              className={`text-sm ${
                                donation.status === "completed" ? "text-green-600" : "text-yellow-600"
                              }`}
                            >
                              {donation.status}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-slate-600 mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(donation.date).toLocaleDateString()}
                          {donation.anonymous && (
                            <span className="ml-4 px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                              Anonymous
                            </span>
                          )}
                        </div>

                        {donation.message && (
                          <div className="bg-slate-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-slate-700">"{donation.message}"</p>
                          </div>
                        )}

                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">Impact:</p>
                          <p className="text-sm text-green-700">{donation.impact}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <Link
                            href={`/campaigns/${donation.campaignId}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            View Campaign
                          </Link>
                          <button className="text-slate-600 hover:text-slate-800 text-sm flex items-center">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share Impact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "campaigns" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-900">Your Campaigns</h3>
                  <Link href="/create-campaign" className="btn-primary">
                    Create New Campaign
                  </Link>
                </div>

                {mockCreatedCampaigns.length > 0 ? (
                  mockCreatedCampaigns.map((campaign) => (
                    <div key={campaign.id} className="card">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900">{campaign.title}</h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                campaign.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {campaign.status}
                            </span>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-slate-600 mb-2">
                              <span>Raised: {formatCurrency(campaign.raised)}</span>
                              <span>{campaign.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-indigo-600 to-sky-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${campaign.progress}%` }}
                              />
                            </div>
                            <div className="text-sm text-slate-500 mt-1">Goal: {formatCurrency(campaign.target)}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-slate-600">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{campaign.donors} donors</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/campaigns/${campaign.id}`}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                              >
                                View Campaign
                              </Link>
                              <Link
                                href={`/campaigns/${campaign.id}/edit`}
                                className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">No campaigns yet</h4>
                    <p className="text-slate-600 mb-4">
                      Start your first campaign and make a difference in your community
                    </p>
                    <Link href="/create-campaign" className="btn-primary">
                      Create Your First Campaign
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">Achievements</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {mockAchievements.map((achievement) => (
                    <div key={achievement.id} className="card">
                      <div className="flex items-center">
                        <div className="text-3xl mr-4">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{achievement.title}</h4>
                          <p className="text-sm text-slate-600">{achievement.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Earned on {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">Account Settings</h3>

                {/* Privacy Settings */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Privacy Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Public Profile</p>
                        <p className="text-sm text-slate-600">Allow others to view your profile</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences.publicProfile}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            preferences: { ...user.preferences, publicProfile: e.target.checked },
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Show Donations</p>
                        <p className="text-sm text-slate-600">Display your donation history publicly</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences.showDonations}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            preferences: { ...user.preferences, showDonations: e.target.checked },
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-600">Receive updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences.emailNotifications}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            preferences: { ...user.preferences, emailNotifications: e.target.checked },
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">SMS Notifications</p>
                        <p className="text-sm text-slate-600">Receive updates via SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.preferences.smsNotifications}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            preferences: { ...user.preferences, smsNotifications: e.target.checked },
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="card">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Social Media Links</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Facebook</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="facebook.com/username"
                        value={user.socialLinks.facebook}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            socialLinks: { ...user.socialLinks, facebook: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Twitter</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="@username"
                        value={user.socialLinks.twitter}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            socialLinks: { ...user.socialLinks, twitter: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="linkedin.com/in/username"
                        value={user.socialLinks.linkedin}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            socialLinks: { ...user.socialLinks, linkedin: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="card border-red-200">
                  <h4 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-red-900">Delete Account</p>
                        <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSaveProfile} className="btn-primary">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
