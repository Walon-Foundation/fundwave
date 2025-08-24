"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Heart, Star, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RecommendedCampaign {
  id: string
  title: string
  creator: string
  category: string
  image: string
  raised: number
  target: number
  donors: number
  progress: number
  matchScore: number
  reason: string
  trending: boolean
}

interface AIRecommendationsProps {
  userId?: string
  currentCampaignId?: string
  userInterests?: string[]
  donationHistory?: any[]
}

const mockRecommendations: RecommendedCampaign[] = [
  {
    id: "rec1",
    title: "Solar Power for Rural Clinic",
    creator: "Dr. Fatima Bangura",
    category: "Healthcare",
    image: "/placeholder.svg?height=200&width=300",
    raised: 1800000,
    target: 3000000,
    donors: 34,
    progress: 60,
    matchScore: 95,
    reason: "Based on your healthcare donations",
    trending: true,
  },
  {
    id: "rec2",
    title: "Girls Education Scholarship Fund",
    creator: "Women's Empowerment SL",
    category: "Education",
    image: "/placeholder.svg?height=200&width=300",
    raised: 2200000,
    target: 4000000,
    donors: 67,
    progress: 55,
    matchScore: 88,
    reason: "Popular in your area",
    trending: false,
  },
  {
    id: "rec3",
    title: "Community Garden Project",
    creator: "Green Sierra Leone",
    category: "Environment",
    image: "/placeholder.svg?height=200&width=300",
    raised: 900000,
    target: 1500000,
    donors: 23,
    progress: 60,
    matchScore: 82,
    reason: "Similar to campaigns you've supported",
    trending: true,
  },
]

export default function AIRecommendations({
  userId,
  currentCampaignId,
  userInterests,
  donationHistory,
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    // Simulate AI recommendation loading
    setTimeout(() => {
      setRecommendations(mockRecommendations)
      setIsLoading(false)
    }, 1500)
  }, [userId, userInterests, donationHistory])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-slate-600"
  }

  const categories = ["all", "healthcare", "education", "environment", "community", "emergency"]

  const filteredRecommendations = recommendations.filter(
    (rec) => selectedCategory === "all" || rec.category.toLowerCase() === selectedCategory,
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          <h2 className="text-xl font-semibold text-slate-900">AI is finding perfect matches for you...</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-2 bg-slate-200 rounded w-full"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-900">Recommended for You</h2>
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">AI Powered</span>
        </div>
        <Link href="/campaigns" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View All Campaigns
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Campaign Image */}
            <div className="relative">
              <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                {campaign.trending && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </span>
                )}
                <span
                  className={`bg-white text-xs px-2 py-1 rounded-full flex items-center ${getMatchScoreColor(campaign.matchScore)}`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  {campaign.matchScore}% match
                </span>
              </div>
            </div>

            {/* Campaign Content */}
            <div className="p-4">
              <div className="mb-3">
                <span className="text-xs text-indigo-600 font-medium">{campaign.category}</span>
                <h3 className="font-semibold text-slate-900 mt-1 line-clamp-2">{campaign.title}</h3>
                <p className="text-sm text-slate-600">by {campaign.creator}</p>
              </div>

              {/* AI Reason */}
              <div className="bg-indigo-50 p-2 rounded-lg mb-3">
                <p className="text-xs text-indigo-800 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {campaign.reason}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>{formatCurrency(campaign.raised)} raised</span>
                  <span>{campaign.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-sky-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Goal: {formatCurrency(campaign.target)}</span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {campaign.donors} donors
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  View Campaign
                </Link>
                <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Heart className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-sky-50 p-6 rounded-lg border">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">AI Insights</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-700 mb-1">
                  <strong>Your Impact Style:</strong> You prefer healthcare and education campaigns
                </p>
                <p className="text-slate-700">
                  <strong>Donation Pattern:</strong> You typically donate {formatCurrency(75000)} every 2 weeks
                </p>
              </div>
              <div>
                <p className="text-slate-700 mb-1">
                  <strong>Best Time to Donate:</strong> Weekends show higher engagement
                </p>
                <p className="text-slate-700">
                  <strong>Community Impact:</strong> Your donations have helped 127 people directly
                </p>
              </div>
            </div>
            <Link
              href="/profile/insights"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3"
            >
              View Detailed Insights
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
