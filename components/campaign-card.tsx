"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Target, Clock, Heart, Share2, TrendingUp, CalendarX, CheckCircle } from "lucide-react"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Campaign } from "@/types/api"
import Image from "next/image"

interface CampaignCardProps {
  campaign: Campaign
  featured?: boolean
  viewMode?: "grid" | "list"
}

export default function CampaignCard({ campaign, featured = false, viewMode = "grid" }: CampaignCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const progress = (campaign.amountReceived / campaign.fundingGoal) * 100
  const getDaysLeft = (endDate: Date) => {
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const daysLeft = getDaysLeft(campaign.campaignEndDate)
  const isCampaignEnded = daysLeft === 0
  const isGoalReached = campaign.amountReceived >= campaign.fundingGoal
  const isCampaignCompleted = isCampaignEnded || isGoalReached

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "SLE",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case "business":
        return "bg-purple-100 text-purple-700"
      case "project":
        return "bg-blue-100 text-blue-700"
      case "personal":
        return "bg-pink-100 text-pink-700"
      case "community":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (viewMode === "list") {
    return (
      <Link href={`/campaigns/${campaign.id}`} className="block">
        <Card
          className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm cursor-pointer hover:scale-[1.02] ${
            featured ? "ring-2 ring-blue-200 shadow-lg" : ""
          }`}
        >
          <div className="flex flex-col sm:flex-row">
            <div className="relative sm:w-80 h-48 sm:h-auto overflow-hidden rounded-l-lg">
              <Image
                src={campaign.image}
                alt={campaign.title}
                height={300}
                width={200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {featured && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge className={`absolute top-3 right-3 shadow-sm ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </Badge>
            </div>

            <CardContent className="flex-1 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {campaign.category}
                </Badge>
                <Badge className={`text-xs ${getCampaignTypeColor(campaign.campaignType)}`}>
                  {campaign.campaignType}
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {campaign.title}
              </h3>

              <p className="text-slate-600 mb-4 line-clamp-2 flex-1">{campaign.shortDescription}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-semibold text-slate-900">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Raised</p>
                    <p className="font-semibold text-slate-900">{formatAmount(campaign.amountReceived)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Goal</p>
                    <p className="font-semibold text-slate-900">{formatAmount(campaign.fundingGoal)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      {/* <AvatarImage
                        src={`/placeholder-icon.png?height=24&width=24&text=${campaign.creatorName.charAt(0)}`}
                      /> */}
                      <AvatarFallback className="text-xs">{campaign.creatorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-600">{campaign.creatorName}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {isCampaignEnded ? "Ended" : isGoalReached ? "Goal Reached" : `${daysLeft} days left`}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/campaigns/${campaign.id}`} className="block">
      <Card
        className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden cursor-pointer hover:scale-[1.02] hover:-translate-y-1 ${
          featured ? "ring-2 ring-blue-200 shadow-lg" : ""
        }`}
      >
        <div className="relative overflow-hidden">
          <Image
            src={campaign.image}
            alt={campaign.title}
            height={300}
            width={200}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {featured && (
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 w-fit shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge variant="secondary" className="w-fit shadow-sm bg-white/90 backdrop-blur-sm">
                {campaign.category}
              </Badge>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <Badge className={`${getStatusColor(campaign.status)} w-fit shadow-sm`}>{campaign.status}</Badge>
              <Badge className={`${getCampaignTypeColor(campaign.campaignType)} w-fit shadow-sm`}>
                {campaign.campaignType}
              </Badge>
            </div>
          </div>

          <div className="hidden sm:block absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="w-9 h-9 p-0 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsLiked(!isLiked)
                }}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : "text-slate-600 hover:text-red-500"
                  }`}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-9 h-9 p-0 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Share2 className="w-4 h-4 text-slate-600 hover:text-blue-600 transition-colors" />
              </Button>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {campaign.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base line-clamp-3">{campaign.shortDescription}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {campaign.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs hover:bg-blue-50 transition-colors">
                  {tag}
                </Badge>
              ))}
              {campaign.tags.length > 3 && (
                <Badge variant="outline" className="text-xs hover:bg-blue-50 transition-colors">
                  +{campaign.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Progress</span>
                <span className="font-semibold text-slate-900 bg-blue-50 px-2 py-1 rounded-full text-xs">
                  {progress.toFixed(1)}%
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-100" />
            </div>

            {/* Amounts: Raised vs Goal */}
            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div>
                <p className="text-slate-600">Raised</p>
                <p className="font-semibold text-slate-900">{formatAmount(campaign.amountReceived)}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-600">Goal</p>
                <p className="font-semibold text-slate-900">{formatAmount(campaign.fundingGoal)}</p>
              </div>
            </div>

            {/* Creator and Location */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 ring-2 ring-gray-100">
                  {/* <AvatarImage
                    src={`/placeholder-icon.png?height=32&width=32&text=${campaign.creatorName.charAt(0)}`}
                  /> */}
                  <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {campaign.creatorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">{campaign.creatorName}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{campaign.location}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isCampaignEnded ? "Ended" : isGoalReached ? "Goal Reached" : daysLeft}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {isCampaignEnded || isGoalReached ? "" : "days left"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 sm:p-6 pt-0">
          {isCampaignCompleted ? (
            <Button
              className="w-full bg-gray-400 hover:bg-gray-500 text-white border-0 shadow-lg cursor-default"
              disabled
            >
              {isGoalReached ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Goal Achieved
                </>
              ) : (
                <>
                  <CalendarX className="w-4 h-4 mr-2" />
                  Campaign Ended
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full shadow-lg hover:shadow-xl transition-all"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <Target className="w-4 h-4 mr-2" />
              Support Campaign
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}