"use client"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import {
  Plus,
  LayoutDashboard,
  MessageSquare,
  Bell,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Define types based on the provided interfaces
interface Campaign {
  _id: string
  campaignName: string
  campaignDescription: string
  amountNeeded: number
  moneyReceived: number
  campaignPicture: string
  backers: number
  createdAt: string
}

interface Comment {
  _id: string
  description: string
  campaignId: string
  campaignName: string
  createdAt: string
}

interface Update {
  _id: string
  description: string
  title: string
  campaignId: string
  campaignName: string
  createdAt: string
}

// Placeholder data
const placeholderCampaigns: Campaign[] = [
  {
    _id: "1",
    campaignName: "Clean Water Initiative",
    campaignDescription:
      "Providing clean water solutions to communities in need through sustainable infrastructure projects.",
    amountNeeded: 1000,
    moneyReceived: 500,
    campaignPicture: "/placeholder.svg?height=200&width=300",
    backers: 12,
    createdAt: "2023-03-15T12:00:00Z",
  },
  {
    _id: "2",
    campaignName: "Education for All",
    campaignDescription:
      "Supporting education initiatives for underprivileged children with books, supplies, and scholarships.",
    amountNeeded: 2000,
    moneyReceived: 750,
    campaignPicture: "/placeholder.svg?height=200&width=300",
    backers: 18,
    createdAt: "2023-02-20T12:00:00Z",
  },
  {
    _id: "3",
    campaignName: "Green Energy Project",
    campaignDescription: "Developing renewable energy solutions for rural communities to reduce carbon footprint.",
    amountNeeded: 1500,
    moneyReceived: 0,
    campaignPicture: "/placeholder.svg?height=200&width=300",
    backers: 0,
    createdAt: "2023-04-01T12:00:00Z",
  },
]

const placeholderComments: Comment[] = [
  {
    _id: "1",
    description: "This is an amazing initiative! I'm excited to see how it develops over time.",
    campaignId: "1",
    campaignName: "Clean Water Initiative",
    createdAt: "2023-04-01T12:00:00Z",
  },
  {
    _id: "2",
    description: "I have some questions about the implementation. Can you provide more details?",
    campaignId: "2",
    campaignName: "Education for All",
    createdAt: "2023-04-03T15:30:00Z",
  },
]

const placeholderUpdates: Update[] = [
  {
    _id: "1",
    title: "Progress Update",
    description: "We've reached our first milestone! The first water well has been completed.",
    campaignId: "1",
    campaignName: "Clean Water Initiative",
    createdAt: "2023-04-02T10:15:00Z",
  },
  {
    _id: "2",
    title: "New Partnership",
    description: "We're excited to announce a new partnership with a local school to expand our reach.",
    campaignId: "2",
    campaignName: "Education for All",
    createdAt: "2023-04-04T09:45:00Z",
  },
]

// Calculate total money received
const totalMoneyReceived = placeholderCampaigns.reduce((sum, campaign) => sum + campaign.moneyReceived, 0)
const totalBackers = placeholderCampaigns.reduce((sum, campaign) => sum + campaign.backers, 0)
const totalGoals = placeholderCampaigns.reduce((sum, campaign) => sum + campaign.amountNeeded, 0)
const percentFunded = (totalMoneyReceived / totalGoals) * 100

export default function UserDashboard() {
  // Format date to "X days/hours ago" format
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main content */}
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Comments</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
            <TabsTrigger value="money" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Money</span>
            </TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Campaigns</h2>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                <Link href='/campaign/create'>
                Create Campaign
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {placeholderCampaigns.map((campaign) => (
                <Card key={campaign._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={campaign.campaignPicture || "/placeholder.svg"}
                      alt={campaign.campaignName}
                      width={300}
                      height={200}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{campaign.campaignName}</CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      Created {formatDate(campaign.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{campaign.campaignDescription}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>${campaign.moneyReceived} raised</span>
                        <span className="font-medium">
                          {Math.round((campaign.moneyReceived / campaign.amountNeeded) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(campaign.moneyReceived / campaign.amountNeeded) * 100}
                        className="h-2 bg-gray-200"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{campaign.backers} backers</span>
                        <span>Goal: ${campaign.amountNeeded}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Comments</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                {placeholderComments.length > 0 ? (
                  <div className="space-y-6">
                    {placeholderComments.map((comment) => (
                      <div key={comment._id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-blue-500 bg-blue-50">
                            {comment.campaignName}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm">{comment.description}</p>
                        <div className="mt-2 flex justify-end">
                          <Link
                            href={`/campaigns/${comment.campaignId}`}
                            className="text-xs text-blue-500 hover:underline flex items-center"
                          >
                            View Campaign <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <MessageSquare className="h-8 w-8 mb-2 text-gray-300" />
                    <p>No comments yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Updates</h2>
              <Button variant="outline" className="text-blue-500 border-blue-500">
                <Plus className="mr-2 h-4 w-4" />
                Post Update
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                {placeholderUpdates.length > 0 ? (
                  <div className="space-y-6">
                    {placeholderUpdates.map((update) => (
                      <div key={update._id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-blue-500 bg-blue-50">
                            {update.campaignName}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDate(update.createdAt)}</span>
                        </div>
                        <h4 className="text-sm font-medium mb-1">{update.title}</h4>
                        <p className="text-sm">{update.description}</p>
                        <div className="mt-2 flex justify-end">
                          <Link
                            href={`/campaigns/${update.campaignId}`}
                            className="text-xs text-blue-500 hover:underline flex items-center"
                          >
                            View Campaign <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <Bell className="h-8 w-8 mb-2 text-gray-300" />
                    <p>No updates yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Money Received Tab */}
          <TabsContent value="money" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Money Received</h2>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-80">Total Raised</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totalMoneyReceived}</div>
                  <p className="text-xs mt-1 opacity-80">Across all campaigns</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totalGoals}</div>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Progress value={percentFunded} className="h-1 flex-1 mr-2" />
                    <span>{Math.round(percentFunded)}% funded</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Backers</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">{totalBackers}</div>
                    <p className="text-xs text-gray-500">Supporters</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Average Donation</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-3xl font-bold">
                      ${totalBackers > 0 ? Math.round(totalMoneyReceived / totalBackers) : 0}
                    </div>
                    <p className="text-xs text-gray-500">Per backer</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Breakdown</CardTitle>
                <CardDescription>Financial details for each of your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {placeholderCampaigns.map((campaign) => (
                    <div key={campaign._id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                            <Image
                              src={campaign.campaignPicture || "/placeholder.svg"}
                              alt={campaign.campaignName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{campaign.campaignName}</h3>
                            <p className="text-xs text-gray-500">{campaign.backers} backers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-500">${campaign.moneyReceived}</div>
                          <div className="text-xs text-gray-500">
                            {Math.round((campaign.moneyReceived / campaign.amountNeeded) * 100)}% of $
                            {campaign.amountNeeded}
                          </div>
                        </div>
                      </div>
                      <Progress value={(campaign.moneyReceived / campaign.amountNeeded) * 100} className="h-2" />
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-500 hover:text-blue-600">
                          View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent campaign contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium text-gray-500 border-b">
                    <div>Date</div>
                    <div className="col-span-2">Campaign</div>
                    <div>Backer</div>
                    <div className="text-right">Amount</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                      <div className="text-gray-500">Apr 5, 2023</div>
                      <div className="col-span-2">Clean Water Initiative</div>
                      <div>Anonymous</div>
                      <div className="text-right font-medium">$50.00</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                      <div className="text-gray-500">Apr 3, 2023</div>
                      <div className="col-span-2">Education for All</div>
                      <div>Sarah M.</div>
                      <div className="text-right font-medium">$25.00</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                      <div className="text-gray-500">Apr 1, 2023</div>
                      <div className="col-span-2">Clean Water Initiative</div>
                      <div>John D.</div>
                      <div className="text-right font-medium">$100.00</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

