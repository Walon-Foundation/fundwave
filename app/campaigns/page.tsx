"use client"

import { useState, useEffect } from "react"
import { Search, Grid, List, SlidersHorizontal, TrendingUp } from "lucide-react"
import CampaignCard from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const mockCampaigns = [
  {
    id: "1",
    title: "Clean Water for Makeni Community",
    description:
      "Help us build a clean water system for 500 families in Makeni. This project will provide sustainable access to clean drinking water for the entire community.",
    image: "/placeholder.svg?height=250&width=400",
    raised: 2500000,
    target: 5000000,
    donors: 45,
    category: "Community",
    creator: "Aminata Kamara",
    location: "Makeni, Northern Province",
    daysLeft: 15,
    featured: true,
  },
  {
    id: "2",
    title: "Solar Power for Rural School",
    description:
      "Bringing electricity to Kono District Primary School to enable evening classes and computer learning for over 200 students.",
    image: "/placeholder.svg?height=250&width=400",
    raised: 1800000,
    target: 3000000,
    donors: 32,
    category: "Education",
    creator: "Mohamed Sesay",
    location: "Kono District",
    daysLeft: 22,
    featured: false,
  },
  {
    id: "3",
    title: "Medical Equipment for Hospital",
    description:
      "Essential medical equipment for Freetown General Hospital to improve healthcare services for thousands of patients in the capital.",
    image: "/placeholder.svg?height=250&width=400",
    raised: 4200000,
    target: 8000000,
    donors: 78,
    category: "Healthcare",
    creator: "Dr. Fatima Bangura",
    location: "Freetown, Western Area",
    daysLeft: 8,
    featured: true,
  },
  {
    id: "4",
    title: "Youth Skills Training Center",
    description:
      "Building a vocational training center for unemployed youth to learn valuable skills and start their own businesses.",
    image: "/placeholder.svg?height=250&width=400",
    raised: 3100000,
    target: 6000000,
    donors: 56,
    category: "Education",
    creator: "Ibrahim Koroma",
    location: "Bo, Southern Province",
    daysLeft: 30,
    featured: false,
  },
  {
    id: "5",
    title: "Emergency Food Relief",
    description:
      "Providing food assistance to flood-affected families in rural communities during this difficult time.",
    image: "/placeholder.svg?height=250&width=400",
    raised: 1200000,
    target: 2000000,
    donors: 89,
    category: "Emergency",
    creator: "Mercy Foundation",
    location: "Multiple Districts",
    daysLeft: 5,
    featured: false,
  },
  {
    id: "6",
    title: "Women's Cooperative Farm",
    description:
      "Supporting women farmers with modern equipment and training to increase agricultural productivity and income.",
    image: "/placeholder.svg?height=250&width=400",
    raised: 800000,
    target: 1500000,
    donors: 23,
    category: "Agriculture",
    creator: "Hawa Turay",
    location: "Kenema District",
    daysLeft: 45,
    featured: false,
  },
]

const categories = [
  "All",
  "Community",
  "Education",
  "Healthcare",
  "Emergency",
  "Agriculture",
  "Technology",
  "Arts & Culture",
]

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "progress", label: "Highest Progress" },
  { value: "goal", label: "Highest Goal" },
  { value: "ending", label: "Ending Soon" },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns)
  const [filteredCampaigns, setFilteredCampaigns] = useState(mockCampaigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock API call
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setCampaigns(mockCampaigns)
      setIsLoading(false)
    }
    fetchCampaigns()
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = campaigns

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((campaign) => campaign.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort campaigns
    switch (sortBy) {
      case "recent":
        break
      case "popular":
        filtered = [...filtered].sort((a, b) => b.donors - a.donors)
        break
      case "progress":
        filtered = [...filtered].sort((a, b) => b.raised / b.target - a.raised / a.target)
        break
      case "goal":
        filtered = [...filtered].sort((a, b) => b.target - a.target)
        break
      case "ending":
        filtered = [...filtered].sort((a, b) => a.daysLeft - b.daysLeft)
        break
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, selectedCategory, searchTerm, sortBy])

  const featuredCampaigns = filteredCampaigns.filter((c) => c.featured)
  const regularCampaigns = filteredCampaigns.filter((c) => !c.featured)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-ocean-50/30 py-8">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-ocean-50/30 py-8">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge className="mb-4 bg-ocean-100 text-ocean-700 hover:bg-ocean-200">🌟 Discover Amazing Causes</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Explore <span className="gradient-text">Campaigns</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover and support amazing projects across Sierra Leone. Every donation makes a difference.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search campaigns, creators, or locations..."
                    className="pl-10 h-12 text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Category Filters */}
            <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-4`}>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "btn-primary" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort and View Options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Badge variant="secondary" className="text-slate-600">
                    {filteredCampaigns.length} campaigns found
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "btn-primary" : ""}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "btn-primary" : ""}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Campaigns */}
        {featuredCampaigns.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-ocean-600 mr-2" />
              <h2 className="text-2xl font-bold text-slate-900">Featured Campaigns</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CampaignCard campaign={campaign} featured />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Campaigns */}
        {regularCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">No campaigns found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search terms or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div>
            {featuredCampaigns.length > 0 && (
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">All Campaigns</h2>
              </div>
            )}
            <div
              className={`grid gap-8 ${
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"
              }`}
            >
              {regularCampaigns.map((campaign, index) => (
                <div
                  key={campaign.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + featuredCampaigns.length) * 0.1}s` }}
                >
                  <CampaignCard campaign={campaign} viewMode={viewMode} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filteredCampaigns.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="btn-outline">
              Load More Campaigns
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
