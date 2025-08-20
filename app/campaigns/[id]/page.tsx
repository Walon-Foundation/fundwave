"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, Share2, Flag, Calendar, MapPin, Users, ThumbsUp, Tag, Trash2 } from "lucide-react"
import DonationModal from "../../../components/donation-modal"
import { useParams } from "next/navigation"
import { api } from "@/lib/api/api"
import type { CampaignDetails, CombinedUserData } from "@/types/api"

export default function CampaignDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [campaignInfo, setCampaignInfo] = useState<CampaignDetails | null>(null)
  const [activeTab, setActiveTab] = useState("story")
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  
  // Temporary variable to simulate current user - replace with actual auth later
  const [currentUser, setCurrentUser] = useState<CombinedUserData>()

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true)
        const [data, user] = await Promise.all([
          api.getCampaignDetails(id),
          api.getProfile()
        ])
        setCurrentUser(user)
        setCampaignInfo(data)
      } catch (err) {
        setError("Failed to load campaign details")
        console.error("Error fetching campaign:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCampaignData()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!campaignInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-500 mb-4">Campaign not found</div>
        </div>
      </div>
    )
  }

  const {
    campaign,
    creator,
    teamMembers = [],
    updates = [],
    comments = [],
    recentDonors = []
  } = campaignInfo

  const progress = (campaign.amountReceived / campaign.fundingGoal) * 100
  const daysLeft = Math.ceil(
    (new Date(campaign.campaignEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
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

    setIsSubmittingComment(true)
    
    try {
      const data = await api.createComment({
        comment: newComment
      }, id)
      
      setCampaignInfo(prev => ({
        ...prev!,
        comments: [data, ...prev!.comments]
      }))
      setNewComment("")
    } catch (err) {
      console.error("Error posting comment:", err)
      setError("Failed to post comment. Please try again.")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return
    
    try {
      const data = await api.deleteComment(id, commentId)
      setCampaignInfo(prev => ({
        ...prev!,
        comments: prev!.comments.filter(comment => comment.id !== commentId)
      }))
      alert("comment deleted")
    } catch (err) {
      console.error("Error deleting comment:", err)
      setError("Failed to delete comment. Please try again.")
    }
  }

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Campaign Image */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-4 sm:mb-6">
              <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
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
                  <span className="text-sm sm:text-base">
                    Ends {formatDate(campaign.campaignEndDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{recentDonors.length} donors</span>
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
                      <div className="space-y-8">
                        {/* Problem Statement Section */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">The Problem</h3>
                          </div>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                              {campaign.problemStatement}
                            </p>
                          </div>
                        </div>

                        {/* Solution Section */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Our Solution</h3>
                          </div>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                              {campaign.solution}
                            </p>
                          </div>
                        </div>

                        {/* Impact Section */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Expected Impact</h3>
                          </div>
                          <div className="prose prose-slate max-w-none">
                            <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                              {campaign.impact}
                            </p>
                          </div>
                        </div>
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
                              <p className="font-semibold text-slate-900 mt-1">
                                {formatDate(campaign.createdAt)}
                              </p>
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
                              <p className="font-semibold text-slate-900 mt-1">
                                {formatDate(campaign.updatedAt)}
                              </p>
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
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <div key={member.id} className="card">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold mx-auto sm:mx-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                            <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                            <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No team members yet</h3>
                      <p className="text-slate-600 text-sm sm:text-base">
                        Check back later for team information!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-4 sm:space-y-6">
                  {updates.length > 0 ? (
                    updates.map((update) => (
                      <div key={update.id} className="card">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{update.title}</h3>
                          <span className="text-sm text-slate-500">
                            {formatDateTime(update.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{update.message}</p>
                        {update.image && (
                          <div className="mt-4">
                            <Image
                              src={update.image}
                              alt={`Update ${update.id} image`}
                              width={600}
                              height={400}
                              className="rounded-lg w-full h-auto"
                            />
                          </div>
                        )}
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
                      disabled={isSubmittingComment}
                    />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-3">
                      <p className="text-xs sm:text-sm text-slate-500">
                        Be respectful and constructive in your comments.
                      </p>
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="btn-primary px-4 sm:px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center min-w-[120px]"
                      >
                        {isSubmittingComment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Posting...
                          </>
                        ) : (
                          "Post Comment"
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="card group relative">
                          {/* Delete button - only show if current user is the comment creator */}
                          {comment?.userId === currentUser?.profile?.id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                              title="Delete comment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <div className="flex items-start space-x-3 pr-8">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium flex-shrink-0">
                              {comment?.username?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                                    {comment?.username}
                                  </h4>
                                  {comment.userId === currentUser?.profile?.id && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      You
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs sm:text-sm text-slate-500">
                                  {formatDateTime(comment?.createdAt)}
                                </span>
                              </div>
                              <p className="text-slate-700 mb-3 leading-relaxed text-sm sm:text-base break-words">
                                {comment.message}
                              </p>
                              <button className="text-xs text-slate-500 hover:text-indigo-600 flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                Like
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
                  <div className="text-xs sm:text-sm text-slate-500">
                    Goal: {formatCurrency(campaign.fundingGoal)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">{recentDonors.length}</div>
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
                  {recentDonors.length > 0 ? (
                    recentDonors.map((donor, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                            {donor.name || "Anonymous"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {donor.time ? formatDateTime(donor.time) : "Recently"}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-indigo-600 flex-shrink-0">
                          {formatCurrency(donor.amount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-sm text-slate-500">No recent donors yet</div>
                    </div>
                  )}
                </div>

                {recentDonors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      View all donors →
                    </button>
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <div className="card mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Campaign Creator</h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold">
                    {creator.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{creator.name}</h4>
                      {creator.verified && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2">{creator.location}</p>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {creator.campaignsCreated} campaigns created
                    </p>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <span className="text-xs text-slate-500">
                        {formatCurrency(creator.totalRaised)} raised
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <DonationModal 
          campaign={{
            id:campaign.id,
            title:campaign.title,
            organizer:campaign.creatorName
          }}
          onClose={() => setShowDonationModal(false)} 
        />
      )}
    </div>
  )
}