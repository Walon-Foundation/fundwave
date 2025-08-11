"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, Share2, Flag, Calendar, MapPin, Users, ThumbsUp, Tag } from "lucide-react"
import DonationModal from "../../../components/donation-modal"
import { axiosInstance } from "@/lib/axiosInstance"

// Mock campaign data matching the exact database schema
const mockCampaign = {
  id: "camp_1234567890",
  title: "Clean Water for Makeni Community",
  fundingGoal: 5000000,
  amountReceived: 2500000, // Note: using correct spelling from schema (amountRecieved)
  location: "Makeni, Northern Province",
  campaignEndDate: "2025-10-29T23:59:59.000Z",
  creatorId: "user_1234567890",
  category: "Community",
  image: "/placeholder.svg?height=400&width=600", // Single image as per schema
  shortDescription:
    "Help us bring clean, safe drinking water to over 500 families in Makeni community through sustainable infrastructure development.",
  fullStory: `
    <h3>The Problem</h3>
    <p>The Makeni community has been struggling with water scarcity for over a decade. Families have to walk miles to fetch water from unsafe sources, leading to waterborne diseases and lost time that could be spent on education and economic activities.</p>
    
    <h3>Our Solution</h3>
    <p>We plan to build a comprehensive water system including:</p>
    <ul>
      <li>Deep water well with solar-powered pump</li>
      <li>Water storage tanks (5,000L capacity)</li>
      <li>Distribution network to key community points</li>
      <li>Water quality testing equipment</li>
      <li>Community training for maintenance</li>
    </ul>
    
    <h3>Impact</h3>
    <p>This project will directly benefit 500 families (approximately 2,500 individuals) by providing clean, safe drinking water within walking distance of their homes. Children will spend more time in school instead of fetching water, and families will have better health outcomes.</p>
    k
    <h3>Budget Breakdown</h3>
    <p>Your donations will be used as follows:</p>
    <ul>
      <li>60% - Water pump and drilling equipment (SLL 3,000,000)</li>
      <li>25% - Storage tanks and distribution pipes (SLL 1,250,000)</li>
      <li>10% - Installation and labor costs (SLL 500,000)</li>
      <li>5% - Maintenance training and tools (SLL 250,000)</li>
    </ul>
    
    <h3>Timeline</h3>
    <p>The project will be completed in phases over 4 months:</p>
    <ul>
      <li>Month 1: Site preparation and drilling</li>
      <li>Month 2: Pump installation and testing</li>
      <li>Month 3: Storage and distribution system</li>
      <li>Month 4: Community training and handover</li>
    </ul>
  `,
  tags: ["water", "community", "health", "infrastructure", "sierra-leone", "sustainability"],
  createdAt: "2024-09-15T10:00:00.000Z",
  updatedAt: "2024-01-20T15:30:00.000Z",
}

// Mock creator data (would come from userTable)
const mockCreator = {
  id: "user_1234567890",
  name: "Aminata Kamara",
  avatar: "/placeholder.svg?height=50&width=50",
  verified: true,
  bio: "Community organizer and water rights advocate",
  location: "Makeni, Northern Province",
  campaignsCreated: 5,
  totalRaised: 10000000,
}

// Mock team members data matching the teamMemberTable schema
const mockTeamMembers = [
  {
    id: "team_001",
    name: "Aminata Kamara",
    role: "Project Lead & Community Organizer",
    bio: "Community organizer with 10+ years experience in water infrastructure projects. Led 5 successful water projects across Northern Province.",
    campaignId: "camp_1234567890",
  },
  {
    id: "team_002",
    name: "Mohamed Bangura",
    role: "Technical Engineer",
    bio: "Water systems engineer specializing in rural community projects. Certified in solar pump installation and maintenance.",
    campaignId: "camp_1234567890",
  },
  {
    id: "team_003",
    name: "Fatima Sesay",
    role: "Community Liaison",
    bio: "Local community leader ensuring project meets community needs. Fluent in Temne and Krio languages.",
    campaignId: "camp_1234567890",
  },
]

// Mock updates data
const mockUpdates = [
  {
    id: "update_001",
    title: "Site Survey Completed Successfully",
    content:
      "We have completed the initial site survey and identified the optimal location for the water well. The geological survey shows excellent water table conditions at 45 meters depth. Local authorities have confirmed the site meets all regulatory requirements.",
    date: "2024-01-20T10:00:00.000Z",
    author: "Aminata Kamara",
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "update_002",
    title: "All Permits Approved - Ready to Begin!",
    content:
      "Excellent news! All necessary permits have been approved by local authorities and the Ministry of Water Resources. We can now proceed with equipment procurement and expect drilling to begin next week.",
    date: "2024-01-25T14:30:00.000Z",
    author: "Mohamed Bangura",
    images: [],
  },
  {
    id: "update_003",
    title: "Community Meeting - 100% Support",
    content:
      "Held a community meeting with over 200 residents. The response was overwhelming - 100% support for the project! Community members have volunteered to help with construction and committed to ongoing maintenance.",
    date: "2024-01-28T16:45:00.000Z",
    author: "Fatima Sesay",
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
]

// Mock comments data
const mockComments = [
  {
    id: "comment_001",
    user: "Mohamed Bangura",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "This is such an important project. Clean water will transform this community! I've seen similar projects succeed and the impact is incredible.",
    date: "2024-01-22T09:15:00.000Z",
    likes: 12,
  },
  {
    id: "comment_002",
    user: "Fatima Sesay",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "I grew up in a similar community. Water scarcity is a real problem that affects everything - health, education, economic opportunities. Thank you for this initiative!",
    date: "2024-01-23T16:45:00.000Z",
    likes: 8,
  },
  {
    id: "comment_003",
    user: "Ibrahim Koroma",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "How will you ensure the sustainability of this project? Will there be ongoing maintenance training for the community?",
    date: "2024-01-24T11:20:00.000Z",
    likes: 5,
  },
  {
    id: "comment_004",
    user: "Adama Conteh",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Amazing work! I donated last week and I'm excited to see the progress. Keep up the great work team!",
    date: "2024-01-26T08:30:00.000Z",
    likes: 15,
  },
]

// Mock recent donors
const mockRecentDonors = [
  { name: "Anonymous", amount: 250000, time: "2 hours ago" },
  { name: "Sarah Johnson", amount: 150000, time: "5 hours ago" },
  { name: "Anonymous", amount: 500000, time: "1 day ago" },
  { name: "Michael Chen", amount: 100000, time: "1 day ago" },
  { name: "Anonymous", amount: 300000, time: "2 days ago" },
]

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [campaign] = useState(mockCampaign)
  const [creator] = useState(mockCreator)
  const [teamMembers] = useState(mockTeamMembers)
  const [updates] = useState(mockUpdates)
  const [comments, setComments] = useState(mockComments)
  const [activeTab, setActiveTab] = useState("story")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [recentDonors] = useState(mockRecentDonors) // Declare recentDonors variable

  const progress = (campaign.amountReceived / campaign.fundingGoal) * 100
  const campaignEndDate = new Date(campaign.campaignEndDate)
  const daysLeft = Math.ceil((campaignEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const totalDonors = 45 // This would come from donations count

  const [realCampaignInfo, setRealCampaignInfo] = useState({})

  // Getting the info from the server
  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await axiosInstance.get(`/campaigns/${id}`)
        if (res.status === 200) {
          setRealCampaignInfo(res.data.data)
        }
      } catch (err) {
        process.env.NODE_ENV === "development" ? console.log(err) : ""
      }
    }

    getInfo()
  }, [params])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: `comment_${Date.now()}`,
      user: "Current User", // This would come from auth context
      avatar: "/placeholder.svg?height=40&width=40",
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
    )
  }

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Campaign Image */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-4 sm:mb-6">
              <Image src={campaign.image || "/placeholder.svg"} alt={campaign.title} fill className="object-cover" />
            </div>

            {/* Campaign Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {campaign.title}
              </h1>

              {/* Campaign Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-slate-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{campaign.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Ends {formatDate(campaign.campaignEndDate)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{totalDonors} donors</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="btn-outline flex items-center justify-center py-2 px-4">
                  <Heart className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Save</span>
                </button>
                <button className="btn-outline flex items-center justify-center py-2 px-4">
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Share</span>
                </button>
                <button className="btn-outline flex items-center justify-center py-2 px-4">
                  <Flag className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">Report</span>
                </button>
              </div>

              {/* Tags */}
              {campaign.tags && campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                  {campaign.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs sm:text-sm hover:bg-slate-200 transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-4 sm:mb-6">
              <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
                {["story", "team", "updates", "comments"].map((tab) => (
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
                    {tab === "team" && ` (${teamMembers.length})`}
                    {tab === "updates" && ` (${updates.length})`}
                    {tab === "comments" && ` (${comments.length})`}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-6 sm:mb-8">
              {activeTab === "story" && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                      <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-indigo-600 prose-strong:text-slate-900">
                        <div
                          className="text-base sm:text-lg leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: campaign.fullStory }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Campaign Details</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Campaign ID</p>
                              <p className="font-mono text-xs text-slate-900 break-all mt-1">{campaign.id}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Category</p>
                              <p className="font-semibold text-slate-900 mt-1">{campaign.category}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Created</p>
                              <p className="font-semibold text-slate-900 mt-1">{formatDate(campaign.createdAt)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 00-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">End Date</p>
                              <p className="font-semibold text-slate-900 mt-1">
                                {formatDate(campaign.campaignEndDate)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Last Updated</p>
                              <p className="font-semibold text-slate-900 mt-1">{formatDate(campaign.updatedAt)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-teal-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Location</p>
                              <p className="font-semibold text-slate-900 mt-1">{campaign.location}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-4 sm:space-y-6">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="card">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <Image
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          width={60}
                          height={60}
                          className="rounded-full mx-auto sm:mx-0"
                        />
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                          <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                          <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-4 sm:space-y-6">
                  {updates.length > 0 ? (
                    updates.map((update) => (
                      <div key={update.id} className="card">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{update.title}</h3>
                          <span className="text-sm text-slate-500">{formatDate(update.date)}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{update.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No updates yet</h3>
                      <p className="text-slate-600 text-sm sm:text-base">Check back later for campaign updates!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div>
                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="card mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Leave a Comment</h3>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts or ask a question..."
                      className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                      rows={4}
                    />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-3">
                      <p className="text-xs sm:text-sm text-slate-500">
                        Be respectful and constructive in your comments.
                      </p>
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="btn-primary px-4 sm:px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="card">
                          <div className="flex items-start space-x-3">
                            <Image
                              src={comment.avatar || "/placeholder.svg"}
                              alt={comment.user}
                              width={40}
                              height={40}
                              className="rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                                <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{comment.user}</h4>
                                <span className="text-xs sm:text-sm text-slate-500">
                                  {formatDateTime(comment.date)}
                                </span>
                              </div>
                              <p className="text-slate-700 mb-3 leading-relaxed text-sm sm:text-base break-words">
                                {comment.content}
                              </p>
                              <button
                                onClick={() => handleLikeComment(comment.id)}
                                className="flex items-center text-xs sm:text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {comment.likes} {comment.likes === 1 ? "like" : "likes"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <ThumbsUp className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No comments yet</h3>
                        <p className="text-slate-600 text-sm sm:text-base">
                          Be the first to comment and show your support!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              {/* Donation Card */}
              <div className="card mb-4 sm:mb-6">
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm text-slate-600 mb-2">
                    <span>Raised: {formatCurrency(campaign.amountReceived)}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 sm:h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">Goal: {formatCurrency(campaign.fundingGoal)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">{totalDonors}</div>
                    <div className="text-xs sm:text-sm text-slate-600">Donors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">{Math.max(0, daysLeft)}</div>
                    <div className="text-xs sm:text-sm text-slate-600">Days Left</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDonationModal(true)}
                  className="btn-primary w-full py-2 sm:py-3 text-base sm:text-lg mb-3 sm:mb-4"
                  disabled={daysLeft <= 0}
                >
                  {daysLeft > 0 ? "Donate Now" : "Campaign Ended"}
                </button>

                <div className="text-center text-xs sm:text-sm text-slate-600">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Campaign ends on {formatDate(campaign.campaignEndDate)}
                </div>
              </div>

              {/* Recent Donors */}
              <div className="card">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Recent Donors</h3>
                <div className="space-y-3">
                  {recentDonors.map((donor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-slate-900 truncate">{donor.name}</div>
                        <div className="text-xs text-slate-500">{donor.time}</div>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-indigo-600 flex-shrink-0">
                        {formatCurrency(donor.amount)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View all donors →
                  </button>
                </div>
              </div>

              {/* Creator Info */}
              <div className="card mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Campaign Creator</h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <Image
                    src={creator.avatar || "/placeholder.svg"}
                    alt={creator.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{creator.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2">{creator.location}</p>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{creator.bio}</p>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <span className="text-xs text-slate-500">{creator.campaignsCreated} campaigns</span>
                      <span className="text-xs text-slate-500">{formatCurrency(creator.totalRaised)} raised</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && <DonationModal campaign={campaign} onClose={() => setShowDonationModal(false)} />}
    </div>
  )
}
