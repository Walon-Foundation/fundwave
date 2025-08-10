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
  const [recentDonors] = useState(mockRecentDonors)
  const [activeTab, setActiveTab] = useState("story")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [newComment, setNewComment] = useState("")

  const progress = (campaign.amountReceived / campaign.fundingGoal) * 100
  const campaignEndDate = new Date(campaign.campaignEndDate)
  const daysLeft = Math.ceil((campaignEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const totalDonors = 45// This would come from donations count

  const [realCampaginInfo, setRealCampaignInfo] = useState({})


  //getting the info from the server
  useEffect(() => {
    const getInfo =  async() => {
      try{
        const res = await axiosInstance.get(`/campaigns/${id}`)
        if(res.status === 200){
          setRealCampaignInfo(res.data.data)
        }
      }catch(err){
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Campaign Image */}
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
              <Image src={campaign.image || "/placeholder.svg"} alt={campaign.title} fill className="object-cover" />
              <div className="absolute top-4 left-4">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    daysLeft > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {daysLeft > 0 ? `${daysLeft} days left` : "Campaign ended"}
                </span>
              </div>
            </div>

            {/* Campaign Title and Creator */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{campaign.title}</h1>

              <p className="text-lg text-slate-600 mb-6">{campaign.shortDescription}</p>

              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Image
                    src={creator.avatar || "/placeholder.svg"}
                    alt={creator.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {creator.name}
                      {creator.verified && <span className="ml-1 text-indigo-600">✓</span>}
                    </p>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {campaign.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="btn-outline flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </button>
                  <button className="btn-outline flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  <button className="btn-outline flex items-center">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </button>
                </div>
              </div>

              {/* Tags */}
              {campaign.tags && campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {campaign.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
              <nav className="flex space-x-8">
                {["story", "team", "updates", "comments"].map((tab) => (
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
                    {tab === "team" && ` (${teamMembers.length})`}
                    {tab === "updates" && ` (${updates.length})`}
                    {tab === "comments" && ` (${comments.length})`}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === "story" && (
                <div className="prose max-w-none">
                  <div className="text-slate-700" dangerouslySetInnerHTML={{ __html: campaign.fullStory }} />

                  <div className="mt-8 p-6 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-4">Campaign Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Campaign ID:</span>
                        <span className="font-mono text-xs text-slate-900">{campaign.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Category:</span>
                        <span className="font-medium text-slate-900">{campaign.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created:</span>
                        <span className="font-medium text-slate-900">{formatDate(campaign.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Updated:</span>
                        <span className="font-medium text-slate-900">{formatDate(campaign.updatedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">End Date:</span>
                        <span className="font-medium text-slate-900">{formatDate(campaign.campaignEndDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Location:</span>
                        <span className="font-medium text-slate-900">{campaign.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-6">
                  {teamMembers.length > 0 ? (
                    <div className="grid md:grid-cols-1 gap-6">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="card">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-600 font-semibold text-lg">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                              <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                              <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No team members</h3>
                      <p className="text-slate-600">This campaign is managed by an individual creator.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-6">
                  {updates.length > 0 ? (
                    updates.map((update) => (
                      <div key={update.id} className="card">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-semibold text-slate-900">{update.title}</h3>
                          <span className="text-sm text-slate-500 whitespace-nowrap ml-4">
                            {formatDateTime(update.date)}
                          </span>
                        </div>
                        <div className="flex items-center mb-4">
                          <span className="text-sm text-slate-600">By {update.author}</span>
                        </div>
                        <p className="text-slate-700 mb-4 leading-relaxed">{update.content}</p>
                        {update.images && update.images.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {update.images.map((image, index) => (
                              <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Update ${update.id} image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No updates yet</h3>
                      <p className="text-slate-600">The campaign creator hasn't posted any updates yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-6">
                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="card">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Leave a Comment</h3>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts, ask questions, or show your support..."
                      className="input min-h-[100px] mb-4"
                      required
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-500">Be respectful and constructive in your comments.</p>
                      <button type="submit" className="btn-primary">
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
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-slate-900">{comment.user}</h4>
                                <span className="text-sm text-slate-500">{formatDateTime(comment.date)}</span>
                              </div>
                              <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
                              <button
                                onClick={() => handleLikeComment(comment.id)}
                                className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {comment.likes} {comment.likes === 1 ? "like" : "likes"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <ThumbsUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No comments yet</h3>
                        <p className="text-slate-600">Be the first to comment and show your support!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Donation Card */}
              <div className="card mb-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Raised: {formatCurrency(campaign.amountReceived)}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-sky-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-slate-500">Goal: {formatCurrency(campaign.fundingGoal)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{totalDonors}</div>
                    <div className="text-sm text-slate-600">Donors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{Math.max(0, daysLeft)}</div>
                    <div className="text-sm text-slate-600">Days Left</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowDonationModal(true)}
                  className="btn-primary w-full py-3 text-lg mb-4"
                  disabled={daysLeft <= 0}
                >
                  {daysLeft > 0 ? "Donate Now" : "Campaign Ended"}
                </button>

                <div className="text-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Campaign ends on {formatDate(campaign.campaignEndDate)}
                </div>
              </div>

              {/* Recent Donors */}
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Donors</h3>
                <div className="space-y-3">
                  {recentDonors.map((donor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">{donor.name}</div>
                        <div className="text-xs text-slate-500">{donor.time}</div>
                      </div>
                      <div className="text-sm font-medium text-slate-900">{formatCurrency(donor.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && <DonationModal onClose={() => setShowDonationModal(!showDonationModal)}  />}
    </div>
  )
}

  // {showDonationModal && <DonationModal campaign={campaign} onClose={() => setShowDonationModal(false)} />
