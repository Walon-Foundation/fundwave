import Link from "next/link"
import Image from "next/image"
import { Users, MapPin, Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Campaign {
  id: string
  title: string
  description: string
  image: string
  raised: number
  target: number
  donors: number
  category: string
  creator: string
  location?: string
  daysLeft?: number
}

interface CampaignCardProps {
  campaign: Campaign
  featured?: boolean
  viewMode?: "grid" | "list"
}

export default function CampaignCard({ campaign, featured = false, viewMode = "grid" }: CampaignCardProps) {
  const progress = (campaign.raised / campaign.target) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Community: "bg-blue-100 text-blue-800",
      Education: "bg-green-100 text-green-800",
      Healthcare: "bg-red-100 text-red-800",
      Emergency: "bg-orange-100 text-orange-800",
      Agriculture: "bg-yellow-100 text-yellow-800",
      Technology: "bg-purple-100 text-purple-800",
      "Arts & Culture": "bg-pink-100 text-pink-800",
    }
    return colors[category as keyof typeof colors] || "bg-slate-100 text-slate-800"
  }

  if (viewMode === "list") {
    return (
      <Card className="card-hover overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative">
              <Image
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                width={400}
                height={250}
                className="w-full h-48 md:h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className={`${getCategoryColor(campaign.category)} font-medium`}>{campaign.category}</Badge>
              </div>
              {featured && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>

            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Link href={`/campaigns/${campaign.id}`}>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2 hover:text-ocean-600 transition-colors line-clamp-2">
                      {campaign.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 mb-4 line-clamp-2">{campaign.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Raised: {formatCurrency(campaign.raised)}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="text-sm text-slate-500 mt-1">Goal: {formatCurrency(campaign.target)}</div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{campaign.donors} donors</span>
                  </div>
                  {campaign.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{campaign.location}</span>
                    </div>
                  )}
                  {campaign.daysLeft && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">by {campaign.creator}</span>
                <Button asChild size="sm" className="btn-primary">
                  <Link href={`/campaigns/${campaign.id}`}>View Campaign</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`card-hover overflow-hidden ${featured ? "ring-2 ring-ocean-200 shadow-glow" : ""}`}>
      <CardContent className="p-0">
        <Link href={`/campaigns/${campaign.id}`}>
          <div className="relative h-48 md:h-56 overflow-hidden">
            <Image
              src={campaign.image || "/placeholder.svg"}
              alt={campaign.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <Badge className={`${getCategoryColor(campaign.category)} font-medium`}>{campaign.category}</Badge>
            </div>
            {featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
            {campaign.daysLeft && campaign.daysLeft <= 7 && (
              <div className="absolute bottom-3 right-3">
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  {campaign.daysLeft} days left
                </Badge>
              </div>
            )}
          </div>
        </Link>

        <div className="p-6">
          <Link href={`/campaigns/${campaign.id}`}>
            <h3 className="text-xl font-semibold text-slate-900 mb-2 hover:text-ocean-600 transition-colors line-clamp-2">
              {campaign.title}
            </h3>
          </Link>

          <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">{campaign.description}</p>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Raised: {formatCurrency(campaign.raised)}</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="text-sm text-slate-500 mt-1">Goal: {formatCurrency(campaign.target)}</div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{campaign.donors} donors</span>
            </div>
            {campaign.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate">{campaign.location}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">by {campaign.creator}</span>
            <Button asChild size="sm" className="btn-primary">
              <Link href={`/campaigns/${campaign.id}`}>Donate Now</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
