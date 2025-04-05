"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  ChevronRight,
  ExternalLink,
  Heart,
  Info,
  MessageCircle,
  Share2,
  Users,
  AlertTriangle,
  Target,
  Award,
  Clock,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { fetchCampaigns, selectCampaignById } from "@/core/store/features/campaigns/campaignSlice"
import { useParams } from "next/navigation"
import type { Campaign } from "@/core/types/types"
import { useAppDispatch, useAppSelector } from "@/core/hooks/storeHooks"
import { addComment,fetchComment } from "@/core/store/features/comments/commentSlice"
import { selectAllComment } from "@/core/store/features/comments/commentSlice"




const CampaignDetails = () => {
  const [activeTab, setActiveTab] = useState("about")
  const [commentText, setCommentText] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [donationAmount, setDonationAmount] = useState<string>("")
  const { id } = useParams()
  const dispatch = useAppDispatch()

  const campaign = useAppSelector((state) => selectCampaignById(state, id as string)) as Campaign
  const allComment = useAppSelector(selectAllComment)
  const campaignComment = allComment.filter(comment => comment.campaignId === id as string)


  // Calculate funding progress percentage
  const fundingProgress = campaign?.amountNeeded
    ? Math.min(Math.round((campaign?.moneyReceived || 0 / campaign?.amountNeeded) * 100), 100)
    : 0

  // Calculate milestone progress percentage
  const milestoneProgress = Math.min(Math.round((campaign?.moneyReceived || 0 / campaign?.amountNeeded) * 100), 100)

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const endDate = new Date(campaign?.completionDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = calculateDaysRemaining()

  // Handle comment submission
  const handleCommentSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try{
      const action = await dispatch(addComment({description:commentText, campaignId:id as string}))
      if(addComment.fulfilled.match(action)){
        await dispatch(fetchComment())
        await dispatch(fetchCampaigns())
        setCommentText("")
      }
    }catch(error){
      console.error(error)
    }
  }

  // Handle donation submission
  const handleDonation = () => {
    if (!donationAmount || Number.parseFloat(donationAmount) <= 0) return
    // In a real app, you would redirect to payment processing
    alert(`Donation amount: NLe${donationAmount}`)
  }

 
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Campaign Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link href="/campaign" className="text-blue-600 hover:underline text-sm flex items-center">
                All Campaigns <ChevronRight className="h-3 w-3" />
              </Link>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">{campaign?.category}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-2">{campaign?.campaignName}</h1>
            <p className="text-lg md:text-xl text-blue-700 mb-4">{campaign?.campaignDescription}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-600 mb-2">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Created by {campaign?.creatorName}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {daysRemaining} days left
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-blue-100">
                {/* Campaign Image */}
                <div className="relative">
                  <Image
                    src={campaign?.campaignPicture}
                    alt={campaign?.campaignName}
                    width={800}
                    height={400}
                    className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover"
                  />
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6  py-6 ">
                    <TabsList className="grid w-full grid-cols-3 bg-blue-50 rounded-md">
                      <TabsTrigger
                        value="about"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm md:text-base py-2"
                      >
                        About
                      </TabsTrigger>
                      <TabsTrigger
                        value="updates"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm md:text-base py-2"
                      >
                        Updates
                      </TabsTrigger>
                      <TabsTrigger
                        value="comments"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm md:text-base py-2"
                      >
                        Comments
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* About Tab */}
                  <TabsContent value="about" className="p-6 space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <Target className="h-5 w-5 mr-2 text-blue-600" />
                          The Problem
                        </h3>
                        <p className="text-gray-700">
                          {campaign?.problem}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-blue-600" />
                          Our Solution
                        </h3>
                        {campaign?.solution.map((solution, index) => (
                          <p className="text-gray-700" key={index}>
                          {index+ 1}. <span>{solution}</span>
                          </p>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <Info className="h-5 w-5 mr-2 text-blue-600" />
                          Expected Impact
                        </h3>
                        <p className="text-gray-700">{campaign?.expectedImpact}</p>
                      </div>

                      <Separator className="my-6 bg-blue-100" />

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-600" />
                          About the Team
                        </h3>
                        <p className="text-gray-700">{campaign?.teamInformation}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                          Risks and Challenges
                        </h3>
                        <p className="text-gray-700">{campaign?.risksAndChallenges}</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Updates Tab */}
                  <TabsContent value="updates" className="p-6 space-y-6">
                    {/* {campaign?.update && campaign?.update?.length > 0 ? (
                      campaign.update.map((update) => (
                        <Card key={update.id} className="bg-white border-blue-100">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-blue-800">{update.title}</CardTitle>
                            <CardDescription>Posted on {formatDate(update.date)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{update.content}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">No updates have been posted yet.</div>
                    )} */}
                  </TabsContent>
                  {/* Comments Tab */}
                  <TabsContent value="comments" className="p-0 sm:p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                        <h3 className="text-lg font-semibold text-blue-800">Comments ({campaign?.comments?.length || 0})</h3>
                      </div>

                      <div className="space-y-6">
                        {campaign?.comments && campaign?.comments?.length > 0 ? (
                          <div className="space-y-6">
                            {campaignComment.map((comment) => (
                              <div
                                key={comment._id}
                                className="flex gap-3 md:gap-4 pb-6 border-b border-blue-100 transition-all hover:bg-blue-50/30 p-3 rounded-lg -mx-3"
                              >
                                <Avatar className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0 border-2 border-blue-50 ring-2 ring-blue-100/50">
                                  <AvatarImage src={`https://avatar.vercel.sh/${comment._id}`} alt={comment?.username} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 font-medium">
                                    {comment?.username?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-medium text-blue-900">{comment?.username}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">{comment?.createdAt}</span>
                                  </div>

                                  <p className="text-gray-700 text-sm md:text-base break-words leading-relaxed">
                                    {comment.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-10 px-4 bg-blue-50/50 rounded-lg border border-blue-100">
                            <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </div>
                            <h4 className="text-lg font-medium text-blue-800 mb-2">Join the conversation</h4>
                            <p className="text-gray-600 max-w-md mx-auto">
                              No comments yet. Be the first to share your thoughts about this campaign!
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 mt-6 border-t border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-3">Add a Comment</h4>
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                          <div className="relative">
                            <Textarea
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Share your thoughts about this campaign..."
                              className="min-h-[120px] border-blue-200 focus-visible:ring-blue-400 pr-12 resize-y"
                              maxLength={4}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                              {commentText.length}/{5}
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 h-auto"
                            disabled={!commentText.trim()}
                          >
                            Post Comment
                          </Button>
                        </form>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Campaign Stats Footer */}
                <CardFooter className="bg-blue-50 border-t border-blue-100 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-blue-700">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {daysRemaining} days left
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {campaign?.backers} backers
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {campaign?.comments?.length || 0} comments
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`border-blue-200 ${isLiked ? "bg-blue-100 text-blue-800" : "text-blue-700 hover:bg-blue-50"}`}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      {isLiked ? (
                        <Heart className="h-4 w-4 mr-1 fill-blue-600 text-blue-600" />
                      ) : (
                        <Heart className="h-4 w-4 mr-1" />
                      )}
                      {isLiked ? "Liked" : "Like"}
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donation Card */}
              <Card className="border-blue-100 shadow-sm hover:shadow transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-blue-800">Support This Project</CardTitle>
                  <CardDescription>
                    Help us reach our goal of NLe{campaign?.amountNeeded?.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-blue-800">NLe{campaign?.moneyReceived || "".toLocaleString()}</span>
                      <span className="text-gray-500">of NLe{campaign?.amountNeeded?.toLocaleString()}</span>
                    </div>
                    <Progress value={fundingProgress} className="h-3 bg-blue-100" />
                    <div className="flex flex-wrap justify-between text-sm gap-2">
                      <span className="text-blue-700 font-medium">{fundingProgress}% funded</span>
                      <span className="text-blue-700 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {daysRemaining} days left
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label htmlFor="donation-amount" className="block text-sm font-medium text-blue-800 mb-1">
                      Enter donation amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">NLe</span>
                      <Input
                        id="donation-amount"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="0"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="pl-10 border-blue-200 focus-visible:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors"
                      onClick={handleDonation}
                      disabled={!donationAmount || Number.parseFloat(donationAmount) <= 0}
                    >
                      Donate Now
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 pt-2">
                    By donating, you agree to our terms of service and privacy policy.
                  </div>
                </CardContent>
              </Card>

              {/* Current Milestone Card */}
              <Card className="border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Current Milestone</CardTitle>
                  <CardDescription>{campaign?.milestone}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-blue-800">
                        NLe{Math.min(campaign?.moneyReceived || 0, campaign?.amountNeeded).toLocaleString()}
                      </span>
                      <span className="text-gray-500">of NLe{campaign?.amountNeeded.toLocaleString()}</span>
                    </div>
                    <Progress value={milestoneProgress} className="h-2 bg-blue-100" />
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700 font-medium">{milestoneProgress}% complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creator Card */}
              <Card className="border-blue-100 shadow-sm hover:shadow transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Campaign Creator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt={campaign?.creatorName} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {campaign?.creatorName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-blue-800">{campaign?.creatorName}</h4>
                      <p className="text-sm text-gray-500">Campaign Organizer</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Creator Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CampaignDetails

