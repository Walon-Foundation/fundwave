"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Heart, Share2, Flag, Calendar, MapPin, Users, ThumbsUp } from "lucide-react"
import DonationModal from "../../../components/donation-modal"

// Mock campaign data
const mockCampaign = {
  id: "1",
  title: "Clean Water for Makeni Community",
  description:
    "Help us build a clean water system for 500 families in Makeni. Access to clean water is a basic human right, yet many communities in Sierra Leone still lack this essential resource. Our project aims to construct a sustainable water system that will serve the Makeni community for years to come.",
  fullDescription: `
    <h3>The Problem</h3>
    <p>The Makeni community has been struggling with water scarcity for over a decade. Families have to walk miles to fetch water from unsafe sources, leading to waterborne diseases and lost time that could be spent on education and economic activities.</p>
    
    <h3>Our Solution</h3>
    <p>We plan to build a comprehensive water system including:</p>
    <ul>
      <li>Deep water well with solar-powered pump</li>
      <li>Water storage tanks</li>
      <li>Distribution network to key community points</li>
      <li>Water quality testing equipment</li>
    </ul>
    
    <h3>Impact</h3>
    <p>This project will directly benefit 500 families (approximately 2,500 individuals) by providing clean, safe drinking water within walking distance of their homes.</p>
  `,
  image: "/placeholder.svg?height=400&width=600",
  raised: 2500000,
  target: 5000000,
  donors: 45,
  category: "Community",
  creator: {
    name: "Aminata Kamara",
    avatar: "/placeholder.svg?height=50&width=50",
    verified: true,
  },
  location: "Makeni, Northern Province",
  createdAt: "2024-01-15",
  endDate: "2024-06-15",
  updates: [
    {
      id: "1",
      title: "Site Survey Completed",
      content: "We have completed the initial site survey and identified the optimal location for the water well.",
      date: "2024-01-20",
      images: ["/placeholder.svg?height=200&width=300"],
    },
    {
      id: "2",
      title: "Permits Approved",
      content: "Great news! All necessary permits have been approved by local authorities.",
      date: "2024-01-25",
      images: [],
    },
  ],
  comments: [
    {
      id: "1",
      user: "Mohamed Bangura",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "This is such an important project. Clean water will transform this community!",
      date: "2024-01-22",
      likes: 12,
    },
    {
      id: "2",
      user: "Fatima Sesay",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "I grew up in a similar community. Water scarcity is a real problem. Thank you for this initiative.",
      date: "2024-01-23",
      likes: 8,
    },
  ],
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState(mockCampaign)
  const [activeTab, setActiveTab] = useState("story")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [newComment, setNewComment] = useState("")

  const progress = (campaign.raised / campaign.target) * 100
  const daysLeft = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    // Mock API call to add comment
    const comment = {
      id: Date.now().toString(),
      user: "Current User",
      avatar: "/placeholder.svg?height=40&width=40",
      content: newComment,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    }

    setCampaign((prev) => ({
      ...prev,
      comments: [comment, ...prev.comments],
    }))
    setNewComment("")
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
            </div>

            {/* Campaign Title and Creator */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{campaign.title}</h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={campaign.creator.avatar || "/placeholder.svg"}
                    alt={campaign.creator.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {campaign.creator.name}
                      {campaign.creator.verified && <span className="ml-1 text-indigo-600">✓</span>}
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
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 mb-6">
              <nav className="flex space-x-8">
                {["story", "updates", "comments"].map((tab) => (
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
                    {tab === "updates" && ` (${campaign.updates.length})`}
                    {tab === "comments" && ` (${campaign.comments.length})`}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === "story" && (
                <div className="prose max-w-none">
                  <p className="text-lg text-slate-700 mb-6">{campaign.description}</p>
                  <div className="text-slate-700" dangerouslySetInnerHTML={{ __html: campaign.fullDescription }} />
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-6">
                  {campaign.updates.map((update) => (
                    <div key={update.id} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-slate-900">{update.title}</h3>
                        <span className="text-sm text-slate-500">{new Date(update.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700 mb-4">{update.content}</p>
                      {update.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
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
                  ))}
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
                      placeholder="Share your thoughts or ask a question..."
                      className="input min-h-[100px] mb-4"
                      required
                    />
                    <button type="submit" className="btn-primary">
                      Post Comment
                    </button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {campaign.comments.map((comment) => (
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
                              <span className="text-sm text-slate-500">
                                {new Date(comment.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-700 mb-3">{comment.content}</p>
                            <button className="flex items-center text-sm text-slate-500 hover:text-indigo-600">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {comment.likes} likes
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <span>Raised: {formatCurrency(campaign.raised)}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-sky-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-slate-500">Goal: {formatCurrency(campaign.target)}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{campaign.donors}</div>
                    <div className="text-sm text-slate-600">Donors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{daysLeft}</div>
                    <div className="text-sm text-slate-600">Days Left</div>
                  </div>
                </div>

                <button onClick={() => setShowDonationModal(true)} className="btn-primary w-full py-3 text-lg mb-4">
                  Donate Now
                </button>

                <div className="text-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Campaign ends on {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>

              {/* Recent Donors */}
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Donors</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">Anonymous Donor</div>
                        <div className="text-xs text-slate-500">2 hours ago</div>
                      </div>
                      <div className="text-sm font-medium text-slate-900">{formatCurrency(50000 * i)}</div>
                    </div>
                  ))}
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
