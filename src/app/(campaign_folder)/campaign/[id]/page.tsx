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

export interface Campaign {
  _id?: string
  campaignName: string
  campaignDescription: string
  category: string
  milestoneTitle: string
  amountNeeded: number
  completionDate: string
  teamInformation: string
  expectedImpact: string
  risksAndChallenges: string
  creatorName: string
  creatorId: string | undefined
  moneyReceived: number
  comments: Comment[]
  updates?: Update[]
  backers?: number
  fundingGoal?: number
  image?: string
}

interface Comment {
  id: string
  name: string
  avatar?: string
  text: string
  date: string
}

interface Update {
  id: string
  title: string
  content: string
  date: string
}

// This would normally come from your assets or API
const campaignImage = "/placeholder.svg?height=500&width=800"

const CampaignDetails = () => {
  const [activeTab, setActiveTab] = useState("about")
  const [commentText, setCommentText] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [donationAmount, setDonationAmount] = useState<string>("")

  // Mock campaign data based on the interface
  const campaign: Campaign = {
    _id: "campaign123",
    campaignName: "Clean Water for Rural Schools",
    campaignDescription: "Help us bring clean water to 10 rural schools in Tanzania",
    category: "Community",
    milestoneTitle: "Equipment Procurement",
    amountNeeded: 4000,
    completionDate: "2025-07-15",
    teamInformation:
      "Our team consists of water engineers, public health specialists, and local community leaders with extensive experience in water purification projects.",
    expectedImpact:
      "This project will directly benefit over 5,000 students, improving their health, increasing school attendance, and empowering communities with knowledge about water management.",
    risksAndChallenges:
      "Potential challenges include logistical difficulties in remote areas, seasonal weather conditions affecting installation timelines, and ensuring long-term maintenance of the systems.",
    creatorName: "Water for All Foundation",
    creatorId: "user456",
    moneyReceived: 6500,
    fundingGoal: 10000,
    backers: 250,
    image: campaignImage,
    comments: [
      {
        id: "comment1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        text: "This is an amazing initiative! I'm glad to be part of this project.",
        date: "2023-06-20",
      },
      {
        id: "comment2",
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        text: "I've seen firsthand the impact of clean water in rural areas. Keep up the great work!",
        date: "2023-06-18",
      },
    ],
    updates: [
      {
        id: "update1",
        title: "First School Installation Complete!",
        content:
          "We're excited to announce that we've completed the installation of our first water purification system at Mwanza Primary School. The students and teachers are thrilled with the new clean water source!",
        date: "2023-06-15",
      },
      {
        id: "update2",
        title: "Halfway to Our Goal",
        content:
          "Thanks to your generous support, we've reached the halfway point of our funding goal. We're now preparing for installations in the next three schools. Keep the momentum going!",
        date: "2023-05-30",
      },
    ],
  }

  // Calculate funding progress percentage
  const fundingProgress = campaign.fundingGoal
    ? Math.min(Math.round((campaign.moneyReceived / campaign.fundingGoal) * 100), 100)
    : 0

  // Calculate milestone progress percentage
  const milestoneProgress = Math.min(Math.round((campaign.moneyReceived / campaign.amountNeeded) * 100), 100)

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const endDate = new Date(campaign.completionDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = calculateDaysRemaining()

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!commentText.trim()) return
    // In a real app, you would send this to your API
    alert(`Comment submitted: ${commentText}`)
    setCommentText("")
  }

  // Handle donation submission
  const handleDonation = () => {
    if (!donationAmount || Number.parseFloat(donationAmount) <= 0) return
    // In a real app, you would redirect to payment processing
    alert(`Donation amount: NLe${donationAmount}`)
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Campaign Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link href="/campaign" className="text-blue-600 hover:underline text-sm flex items-center">
                All Campaigns <ChevronRight className="h-3 w-3" />
              </Link>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">{campaign.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">{campaign.campaignName}</h1>
            <p className="text-xl text-blue-700 mb-4">{campaign.campaignDescription}</p>
            <div className="flex items-center text-sm text-blue-600 mb-2">
              <span className="flex items-center mr-4">
                <Users className="h-4 w-4 mr-1" />
                Created by {campaign.creatorName}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {daysRemaining} days left
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-blue-100">
                {/* Campaign Image */}
                <div className="relative">
                  <Image
                    src={campaign.image || campaignImage}
                    alt={campaign.campaignName}
                    width={800}
                    height={400}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-3 bg-blue-50">
                      <TabsTrigger
                        value="about"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        About
                      </TabsTrigger>
                      <TabsTrigger
                        value="updates"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        Updates
                      </TabsTrigger>
                      <TabsTrigger
                        value="comments"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
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
                          Many rural schools in Tanzania lack access to clean water, leading to waterborne diseases and
                          decreased school attendance. Students often have to walk long distances to fetch water, which
                          takes away from their learning time and exposes them to various risks.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-blue-600" />
                          Our Solution
                        </h3>
                        <p className="text-gray-700">
                          We will install modern water purification systems in each school and provide education on
                          water conservation and hygiene practices. Our comprehensive approach includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700">
                          <li>Installing sustainable water purification systems at 10 rural schools</li>
                          <li>Training school staff on system maintenance and water management</li>
                          <li>Educating students and communities on hygiene practices</li>
                          <li>Establishing water management committees at each school</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <Info className="h-5 w-5 mr-2 text-blue-600" />
                          Expected Impact
                        </h3>
                        <p className="text-gray-700">{campaign.expectedImpact}</p>
                      </div>

                      <Separator className="my-6 bg-blue-100" />

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-600" />
                          About the Team
                        </h3>
                        <p className="text-gray-700">{campaign.teamInformation}</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                          Risks and Challenges
                        </h3>
                        <p className="text-gray-700">{campaign.risksAndChallenges}</p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Updates Tab */}
                  <TabsContent value="updates" className="p-6 space-y-6">
                    {campaign.updates && campaign.updates.length > 0 ? (
                      campaign.updates.map((update) => (
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
                    )}
                  </TabsContent>

                  {/* Comments Tab */}
                  <TabsContent value="comments" className="p-6 space-y-6">
                    <div className="space-y-6">
                      {campaign.comments && campaign.comments.length > 0 ? (
                        campaign.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-4 pb-4 border-b border-blue-100">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={comment.avatar} alt={comment.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {comment.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-blue-800">{comment.name}</h4>
                                <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                              </div>
                              <p className="mt-1 text-gray-700">{comment.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
                      )}

                      <div className="pt-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Add a Comment</h4>
                        <Textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Share your thoughts about this campaign..."
                          className="min-h-[100px] border-blue-200 focus-visible:ring-blue-400"
                        />
                        <Button
                          onClick={handleCommentSubmit}
                          className="mt-3 bg-blue-600 hover:bg-blue-700"
                          disabled={!commentText.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Campaign Stats Footer */}
                <CardFooter className="bg-blue-50 border-t border-blue-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-blue-700">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {daysRemaining} days left
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {campaign.backers} backers
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {campaign.comments?.length || 0} comments
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
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
              <Card className="border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-blue-800">Support This Project</CardTitle>
                  <CardDescription>
                    Help us reach our goal of NLe{campaign.fundingGoal?.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-blue-800">NLe{campaign.moneyReceived.toLocaleString()}</span>
                      <span className="text-gray-500">of NLe{campaign.fundingGoal?.toLocaleString()}</span>
                    </div>
                    <Progress value={fundingProgress} className="h-2 bg-blue-100" />
                    <div className="flex justify-between text-sm">
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
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
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
                  <CardDescription>{campaign.milestoneTitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-blue-800">
                        NLe{Math.min(campaign.moneyReceived, campaign.amountNeeded).toLocaleString()}
                      </span>
                      <span className="text-gray-500">of NLe{campaign.amountNeeded.toLocaleString()}</span>
                    </div>
                    <Progress value={milestoneProgress} className="h-2 bg-blue-100" />
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700 font-medium">{milestoneProgress}% complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creator Card */}
              <Card className="border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Campaign Creator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=48&width=48" alt={campaign.creatorName} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {campaign.creatorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-blue-800">{campaign.creatorName}</h4>
                      <p className="text-sm text-gray-500">Campaign Organizer</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
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

