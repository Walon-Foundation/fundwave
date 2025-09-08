"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, Share2, Flag, Calendar, MapPin, Users, ThumbsUp, Tag, Trash2, Edit, Save, X, ChevronLeft, ChevronRight, LogIn } from "lucide-react"
import DonationModal from "@/components/donation-modal"
import { useParams } from "next/navigation"
import { api } from "@/lib/api/api"
import type { CampaignDetails, CombinedUserData } from "@/types/api"
import Link from "next/link"

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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [currentUser, setCurrentUser] = useState<CombinedUserData | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Pagination states for updates
  const [updatesPage, setUpdatesPage] = useState(1)
  const [commentsPage, setCommentsPage] = useState(1)
  const [itemsPerPage] = useState(3) // Number of items per page

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true)
        setIsCheckingAuth(true)
        
        // Fetch campaign data first
        const data = await api.getCampaignDetails(id)
        setCampaignInfo(data)
        
        // Try to fetch user profile (might fail if not logged in)
        try {
          const user = await api.getProfile()
          setCurrentUser(user)
        } catch (err) {
          console.log("User not logged in")
          setCurrentUser(null)
        }
      } catch (err) {
        setError("Failed to load campaign details")
        console.error("Error fetching campaign:", err)
      } finally {
        setIsLoading(false)
        setIsCheckingAuth(false)
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
  const isCampaignEnded = daysLeft <= 0
  const isGoalReached = campaign.amountReceived >= campaign.fundingGoal
  const isCampaignCompleted = isCampaignEnded || isGoalReached

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "NLe",
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
    if (!currentUser) {
      // Redirect to login or show login modal
      alert("Please log in to comment")
      return
    }

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
      // Reset to first page when adding a new comment
      setCommentsPage(1)
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
      await api.deleteComment(id, commentId)
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

  const handleStartEditComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId)
    setEditCommentText(currentText)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }

  const handleSaveEdit = async (commentId: string) => {
    if (!editCommentText.trim()) return
    
    try {
      const updatedComment = await api.updateComment({comment:editCommentText}, id, commentId)
      setCampaignInfo(prev => ({
        ...prev!,
        comments: prev!.comments.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      }))
      
      setEditingCommentId(null)
      setEditCommentText("")
      alert("Comment updated successfully")
    } catch (err) {
      console.error("Error updating comment:", err)
      setError("Failed to update comment. Please try again.")
    }
  }

  // Pagination functions for updates
  const totalUpdatesPages = Math.ceil(updates.length / itemsPerPage)
  const currentUpdates = updates.slice(
    (updatesPage - 1) * itemsPerPage,
    updatesPage * itemsPerPage
  )

  const handleUpdatesPageChange = (newPage: number) => {
    setUpdatesPage(newPage)
  }

  // Pagination functions for comments
  const totalCommentsPages = Math.ceil(comments.length / itemsPerPage)
  const currentComments = comments.slice(
    (commentsPage - 1) * itemsPerPage,
    commentsPage * itemsPerPage
  )

  const handleCommentsPageChange = (newPage: number) => {
    setCommentsPage(newPage)
  }

  // Pagination component
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void 
  }) => {
    if (totalPages <= 1) return null

    return (
      <div className="flex items-center justify-between mt-6 border-t border-slate-200 pt-4">
        <div className="text-sm text-slate-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Campaign Info Section - Reorganized hierarchy */}
        <div className="lg:hidden">
          {/* Campaign Info at the top */}
          <div className="card mb-4">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">{campaign.title}</h1>
            
            <div className="flex flex-col gap-3 text-slate-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{campaign.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Ends {formatDate(campaign.campaignEndDate)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Raised: {formatCurrency(campaign.amountReceived)}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="text-sm text-slate-500">
                Goal: {formatCurrency(campaign.fundingGoal)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">{recentDonors.length}</div>
                <div className="text-sm text-slate-600">Donors</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-900">{Math.max(0, daysLeft)}</div>
                <div className="text-sm text-slate-600">Days Left</div>
              </div>
            </div>
          </div>

          {/* Donation Button in the middle */}
          <div className="card mb-4">
            <button
              onClick={() => setShowDonationModal(true)}
              className="btn-primary w-full py-3 text-base mb-3"
              disabled={isCampaignCompleted}
            >
              {isCampaignCompleted 
                ? isGoalReached 
                  ? "Goal Reached" 
                  : "Campaign Ended"
                : "Donate Now"
              }
            </button>

            <div className="text-center text-sm text-slate-600">
              <Calendar className="w-4 h-4 inline mr-1" />
              Campaign ends on {formatDate(campaign.campaignEndDate)}
            </div>
          </div>

          {/* Creator Info */}
          <div className="card mb-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Campaign Creator</h3>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold">
                {creator.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{creator.name}</h4>
                  {creator.verified && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">{creator.location}</p>
                <p className="text-sm text-slate-700">
                  {creator.campaignsCreated} campaigns created
                </p>
                <div className="mt-2">
                  <span className="text-xs text-slate-500">
                    {formatCurrency(creator.totalRaised)} raised
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Donors */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Donors</h3>
            <div className="space-y-3">
              {recentDonors.length > 0 ? (
                recentDonors.slice(0, 3).map((donor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {donor.name || "Anonymous"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {donor.time ? formatDateTime(donor.time) : "Recently"}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-indigo-600 flex-shrink-0">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Campaign Image - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-4 sm:mb-6">
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Campaign Header - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block mb-6">
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
                  {currentUpdates.length > 0 ? (
                    <>
                      {currentUpdates.map((update) => (
                        <div key={update.id} className="card">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">{update.title}</h3>
                            <span className="text-sm text-slate-500">
                              {formatDateTime(update?.createdAt)}
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
                      ))}
                      <Pagination
                        currentPage={updatesPage}
                        totalPages={totalUpdatesPages}
                        onPageChange={handleUpdatesPageChange}
                      />
                    </>
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
                <div className="space-y-6">
                  {/* Comment Form - Only show if user is logged in */}
                  {currentUser ? (
                    <form onSubmit={handleCommentSubmit} className="card">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Leave a Comment</h3>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts or ask a question..."
                        className="input min-h-[100px] mb-4"
                        required
                      />
                      <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={isSubmittingComment}
                      >
                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                      </button>
                    </form>
                  ) : (
                    <div className="card text-center py-8">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Sign in to comment</h3>
                      <p className="text-slate-600 mb-4">You need to be logged in to leave a comment.</p>
                      <Link 
                        href="/login" 
                        className="btn-primary inline-flex items-center"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Link>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-4">
                    {currentComments.length > 0 ? (
                      <>
                        {currentComments.map((comment) => (
                          <div key={comment.id} className="card group relative">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium flex-shrink-0">
                                {comment?.username?.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                {/* Header with name, timestamp, and actions */}
                                <div className="flex items-start justify-between mb-2 gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                                        {comment?.username}
                                      </h4>
                                      {comment.userId === currentUser?.profile?.id && (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex-shrink-0">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs sm:text-sm text-slate-500 block">
                                      {formatDateTime(comment?.createdAt)}
                                      {comment?.updatedAt !== comment?.createdAt && " (edited)"}
                                    </span>
                                  </div>

                                  {/* Action buttons - only show if current user is the comment creator */}
                                  {comment?.userId === currentUser?.profile?.id && (
                                    <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                      {editingCommentId === comment.id ? (
                                        <>
                                          <button
                                            onClick={() => handleSaveEdit(comment.id)}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                            title="Save changes"
                                          >
                                            <Save className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={handleCancelEdit}
                                            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                                            title="Cancel edit"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => handleStartEditComment(comment.id, comment.message)}
                                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit comment"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete comment"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Comment content */}
                                {editingCommentId === comment.id ? (
                                  <div className="mb-3">
                                    <textarea
                                      value={editCommentText}
                                      onChange={(e) => setEditCommentText(e.target.value)}
                                      className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                                      rows={3}
                                    />
                                  </div>
                                ) : (
                                  <p className="text-slate-700 mb-3 leading-relaxed text-sm sm:text-base break-words">
                                    {comment.message}
                                  </p>
                                )}

                                {/* Like button */}
                                <button className="text-xs text-slate-500 hover:text-indigo-600 flex items-center transition-colors">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  Like
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Pagination
                          currentPage={commentsPage}
                          totalPages={totalCommentsPages}
                          onPageChange={handleCommentsPageChange}
                        />
                      </>
                    ) : (
                    <div className="text-center py-8 sm:py-12">
                      <ThumbsUp className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No comments yet</h3>
                      <p className="text-slate-600 text-sm sm:text-base">
                        {currentUser 
                          ? "Be the first to comment and show your support!" 
                          : "Sign in to be the first to comment!"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="lg:col-span-1 order-1 lg:order-2 hidden lg:block">
          <div className="lg:sticky lg:top-8">
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
                <div className="text-sm text-slate-500">
                  Goal: {formatCurrency(campaign.fundingGoal)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{recentDonors.length}</div>
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
                disabled={isCampaignCompleted}
              >
                {isCampaignCompleted 
                  ? isGoalReached 
                    ? "Goal Reached" 
                    : "Campaign Ended"
                  : "Donate Now"
                }
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
                {recentDonors.length > 0 ? (
                  recentDonors.slice(0, 5).map((donor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {donor.name || "Anonymous"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {donor.time ? formatDateTime(donor.time) : "Recently"}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-indigo-600 flex-shrink-0">
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
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View all donors →
                  </button>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Campaign Creator</h3>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold">
                  {creator.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{creator.name}</h4>
                    {creator.verified && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{creator.location}</p>
                  <p className="text-sm text-slate-700">
                    {creator.campaignsCreated} campaigns created
                  </p>
                  <div className="mt-2">
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
  </div>  
)} 