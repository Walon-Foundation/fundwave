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
import { Card, CardContent,  CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import CampaignCard from "@/components/campaign/designSection/dashboardUI/campaignCard"
import CommentCard from "@/components/campaign/designSection/dashboardUI/commentCard"
import { selectAllCampaign } from "@/core/store/features/campaigns/campaignSlice"
import { useAppSelector } from "@/core/hooks/storeHooks"
import { selectAllComment } from "@/core/store/features/comments/commentSlice"
import { selectAllUpdate } from "@/core/store/features/update/updateSlice"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { User } from "@/core/types/types"


export default function UserDashboard() {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  //getting the user
  const token = Cookies.get("userToken")
  const user = jwtDecode(token!) as User

  const allCampaign = useAppSelector(selectAllCampaign)
  const allComments = useAppSelector(selectAllComment)
  const allUpdates = useAppSelector(selectAllUpdate)

  //data from the server
  const userCampaign = allCampaign.filter((campaign) => campaign.creatorId === user._id)
  const campaignComment = userCampaign.map((campaign) => allComments.filter((comment) => comment.campaignId === campaign._id)).flat()
  const campaignUpdate = userCampaign.map((campaign) => allUpdates.filter((update) => update.campaignId === campaign._id)).flat()


  // Calculate total money received
  const totalMoneyReceived = userCampaign.reduce((sum, campaign) => sum + (campaign.moneyReceived ?? 0), 0)
  const totalBackers = userCampaign.reduce((sum, campaign) => sum + (campaign.backers ?? 0), 0)
  const totalGoals = userCampaign.reduce((sum, campaign) => sum + campaign.amountNeeded, 0)
  const percentFunded = (totalMoneyReceived / totalGoals) * 100



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
              {userCampaign.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Comments</h2>
            </div>
            <CommentCard comments={campaignComment} />
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
                {campaignUpdate.length > 0 ? (
                  <div className="space-y-6">
                    {campaignUpdate.map((update) => (
                      <div key={update._id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-blue-500 bg-blue-50">
                            {update.campaignName}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatDate(update.createdAt as string)}</span>
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
                  <div className="text-3xl font-bold">NLe{totalMoneyReceived}</div>
                  <p className="text-xs mt-1 opacity-80">Across all campaigns</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">NLe{totalGoals}</div>
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
                      NLe{totalBackers > 0 ? Math.round(totalMoneyReceived / totalBackers) : 0}
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
                  {userCampaign.map((campaign) => (
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
                          <div className="font-bold text-blue-500">NLe{campaign.moneyReceived}</div>
                          <div className="text-xs text-gray-500">
                            {Math.round(((campaign.moneyReceived ?? 0) / campaign.amountNeeded) * 100)}% of NLe
                            {campaign.amountNeeded}
                          </div>
                        </div>
                      </div>
                      <Progress value={((campaign.moneyReceived ?? 0 ) / campaign.amountNeeded) * 100} className="h-2" />
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

