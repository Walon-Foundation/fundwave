"use client"

import { useState, useEffect } from "react"
import { Search, Grid, List, TrendingUp, Filter, X } from "lucide-react"
import CampaignCard from "../../components/campaign-card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { api } from "@/lib/api/api"
import { EmptyState } from "@/components/empty-state"
import { Campaign } from "@/types/api"

const categories = [
  "Community",
  "Education",
  "Healthcare",
  "Emergency",
  "Agriculture",
  "Technology",
  "Arts & Culture",
  "Sports",
  "Environment",
  "Business",
]

const campaignTypes = [
  { value: "all", label: "All Types" },
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
  { value: "project", label: "Project" },
  { value: "community", label: "Community" },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
]

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Funded" },
  { value: "progress", label: "Highest Progress" },
  { value: "goal", label: "Highest Goal" },
  { value: "ending", label: "Ending Soon" },
]

// Number of campaigns to load per click
const CAMPAIGNS_PER_PAGE = 10

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [displayedCampaigns, setDisplayedCampaigns] = useState<Campaign[]>([])
  const [displayCount, setDisplayCount] = useState(CAMPAIGNS_PER_PAGE)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true)
      try {
        const data = await api.getCampaigns()
        setCampaigns(Array.isArray(data) ? data : [])
        setFilteredCampaigns(Array.isArray(data) ? data : [])
      } catch (err) {
        setCampaigns([])
        setFilteredCampaigns([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  useEffect(() => {
    let filtered = Array.isArray(campaigns) ? [...campaigns] : []

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((campaign) => campaign?.category === selectedCategory)
    }

    // Filter by campaign type
    if (selectedType !== "all") {
      filtered = filtered.filter((campaign) => campaign?.campaignType === selectedType)
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((campaign) => campaign?.status === selectedStatus)
    }

    // Enhanced search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (campaign) =>
          campaign?.title?.toLowerCase()?.includes(searchLower) ||
          campaign?.shortDescription?.toLowerCase()?.includes(searchLower) ||
          campaign?.creatorName?.toLowerCase()?.includes(searchLower) ||
          campaign?.location?.toLowerCase()?.includes(searchLower) ||
          campaign?.category?.toLowerCase()?.includes(searchLower) ||
          campaign?.problemStatement?.toLowerCase()?.includes(searchLower) ||
          campaign?.solution?.toLowerCase()?.includes(searchLower)
      )
    }

    // Sorting
    switch (sortBy) {
      case "recent":
        filtered = [...filtered].sort(
          (a, b) => (new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
        ))
        break
      case "popular":
        filtered = [...filtered].sort((a, b) => (b?.amountReceived || 0) - (a?.amountReceived || 0))
        break
      case "progress":
        filtered = [...filtered].sort(
          (a, b) => 
            (b?.amountReceived || 0) / (b?.fundingGoal || 1) - 
            (a?.amountReceived || 0) / (a?.fundingGoal || 1)
        )
        break
      case "goal":
        filtered = [...filtered].sort((a, b) => (b?.fundingGoal || 0) - (a?.fundingGoal || 0))
        break
      case "ending":
        filtered = [...filtered].sort(
          (a, b) => 
            new Date(a?.campaignEndDate || 0).getTime() - 
            new Date(b?.campaignEndDate || 0).getTime()
        )
        break
    }

    setFilteredCampaigns(filtered)
    // Reset display count when filters change
    setDisplayCount(CAMPAIGNS_PER_PAGE)
  }, [campaigns, selectedCategory, selectedType, selectedStatus, searchTerm, sortBy])

  // Update displayed campaigns whenever filtered campaigns or display count changes
  useEffect(() => {
    setDisplayedCampaigns(filteredCampaigns.slice(0, displayCount))
  }, [filteredCampaigns, displayCount])

  const loadMore = () => {
    setDisplayCount(prev => prev + CAMPAIGNS_PER_PAGE)
  }

  const hasMoreCampaigns = displayCount < filteredCampaigns.length

  const getDaysLeft = (endDate?: Date) => {
    if (!endDate) return Infinity
    const now = new Date()
    const end = new Date(endDate)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const featuredCampaigns = Array.isArray(displayedCampaigns) ? displayedCampaigns.filter((campaign) => {
    const progress = (campaign?.amountReceived || 0) / (campaign?.fundingGoal || 1)
    const daysLeft = getDaysLeft(campaign?.campaignEndDate || new Date())
    return progress > 0.7 || daysLeft <= 10
  }) : []

  const regularCampaigns = Array.isArray(displayedCampaigns) ? displayedCampaigns.filter((campaign) => {
    const progress = (campaign?.amountReceived || 0) / (campaign?.fundingGoal || 1)
    const daysLeft = getDaysLeft(campaign?.campaignEndDate || new Date())
    return progress <= 0.7 && daysLeft > 10
  }) : []

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedType("all")
    setSelectedStatus("all")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">🌟 Discover Amazing Causes</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campaigns
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Discover and support amazing projects across Sierra Leone. Every donation makes a difference.
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="mb-6 sm:mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Enhanced Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search campaigns, creators, locations..."
                    className="pl-10 h-12 text-base sm:text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden h-12">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategory !== "All" ||
                  selectedType !== "all" ||
                  selectedStatus !== "all") && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700">
                    {[
                      selectedCategory !== "All" ? 1 : 0,
                      selectedType !== "all" ? 1 : 0,
                      selectedStatus !== "all" ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Enhanced Filters */}
            <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
              {/* Category Filters */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Campaign Type and Status Filters */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Campaign Type</h3>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Status</h3>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sort and View Options */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
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

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-slate-600">
                      Showing {displayedCampaigns.length} of {filteredCampaigns.length} campaigns
                    </Badge>

                    {(selectedCategory !== "All" ||
                      selectedType !== "all" ||
                      selectedStatus !== "all" ||
                      searchTerm) && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
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
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Featured Campaigns</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CampaignCard campaign={campaign} featured />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Campaigns */}
        {displayedCampaigns.length === 0 ? (
          <EmptyState
            title="No campaigns found"
            description="Try adjusting your search terms or filters"
            action={<Button onClick={clearAllFilters} className="bg-blue-600 hover:bg-blue-700">Clear All Filters</Button>}
          />
        ) : (
          <div>
            {featuredCampaigns.length > 0 && (
              <div className="flex items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">All Campaigns</h2>
              </div>
            )}
            <div
              className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"
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

        {/* Load More Button - Only show if there are more campaigns to load */}
        {hasMoreCampaigns && (
          <div className="text-center mt-8 sm:mt-12">
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
            >
              Load More Campaigns ({filteredCampaigns.length - displayedCampaigns.length} remaining)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}