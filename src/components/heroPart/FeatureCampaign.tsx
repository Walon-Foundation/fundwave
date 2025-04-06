"use client"
import Link from "next/link"
import Image from "next/image"
import { FaXTwitter, FaFacebookF} from "react-icons/fa6"
import { selectAllCampaign } from "@/core/store/features/campaigns/campaignSlice"
import { useAppSelector } from "@/core/hooks/storeHooks"

import { ArrowRight, Clock } from "lucide-react"
import { Button } from "../ui/button"

export default function FeaturedCampaign() {
  const allCampaign = useAppSelector(selectAllCampaign)
  const campaignList = allCampaign.slice(0, 4)

  // Calculate days remaining (placeholder function)
  const calculateDaysRemaining = (endDate: string) => {
    if (!endDate) return 30 // Default value
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">Featured Campaigns</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-blue-700 text-lg">
            Discover and support these impactful initiatives making a difference in our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {campaignList.map((campaign) => (
            <div
              key={campaign._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-blue-100"
            >
              {/* Campaign Image with Overlay */}
              <div className="relative overflow-hidden">
                <Image
                  src={campaign?.campaignPicture || "/placeholder.svg"}
                  alt={campaign.campaignName}
                  height={300}
                  width={500}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-blue-600/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {campaign.category || "Campaign"}
                </div>

                {/* Days Left Badge */}
                <div className="absolute top-4 right-4 bg-white/90 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center backdrop-blur-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {calculateDaysRemaining(campaign.completionDate)} days left
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Quick Actions on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center">
                  <Link
                    href={`/campaign/${campaign._id}`}
                    className="text-white font-medium text-sm flex items-center hover:underline"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                  <div className="flex gap-3">
                    <button className="text-white hover:text-blue-200 transition-colors" aria-label="Share on Twitter">
                      <FaXTwitter size={16} />
                    </button>
                    <button className="text-white hover:text-blue-200 transition-colors" aria-label="Share on Facebook">
                      <FaFacebookF size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Campaign Content */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-bold text-lg text-blue-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                  {campaign.campaignName}
                </h3>
                <p className="text-blue-700 text-sm mb-4 line-clamp-2">{campaign.campaignDescription}</p>

                {/* Funding Progress */}
                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-blue-800">
                      NLe{campaign.moneyReceived?.toLocaleString() || "0"}
                    </span>
                    <span className="text-blue-600">of NLe{campaign.amountNeeded?.toLocaleString() || "0"}</span>
                  </div>

                  {/* Progress Bar with Animation */}
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(((campaign?.moneyReceived || 0) / (campaign?.amountNeeded || 1)) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                   <Button className="bg-blue-600 hover:bg-blue-700 ">
                   <Link
                      href={`/campaign/${campaign._id}`}
                      className=" text-white text-sm font-medium  transition-colors"
                    >
                      Support Now
                    </Link>
                   </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/campaign"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-medium py-3 px-8 rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
          >
            Explore All Campaigns
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

