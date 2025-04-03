"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Filter, Search, Users } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { selectAllCampaign } from "@/core/store/features/campaigns/campaignSlice"
import { useAppSelector } from "@/core/hooks/storeHooks"
import type { Campaign } from "@/core/types/types"



// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Renewable Energy": {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  Education: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  Environment: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  Healthcare: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
  Technology: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  Community: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  Arts: {
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200",
  },
  Sports: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    border: "border-indigo-200",
  },
}

// Default color for categories not in the mapping
const defaultCategoryColor = {
  bg: "bg-gray-100",
  text: "text-gray-800",
  border: "border-gray-200",
}

// Campaign type definition

export default function ExploreCampaigns() {
  const originalCampaignList = useAppSelector(selectAllCampaign)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemsPerPage, _setItemsPerPage] = useState(3)

  // Filtered campaigns state
  const [filteredCampaigns, setFilteredCampaigns] = useState(originalCampaignList)
  const [paginatedCampaigns, setPaginatedCampaigns] = useState<Campaign[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // Apply filters whenever filter states change
  useEffect(() => {
    if (!originalCampaignList || originalCampaignList.length === 0) {
      setFilteredCampaigns([])
      return
    }

    let result = [...originalCampaignList]

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (campaign) =>
          campaign?.campaignName?.toLowerCase()?.includes(query) ||
          campaign?.campaignDescription?.toLowerCase()?.includes(query),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      // Convert kebab-case to Title Case for matching
      const formattedCategory = categoryFilter
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      result = result.filter((campaign) => campaign.category.toLowerCase() === formattedCategory.toLowerCase())
    }

    // Apply sorting
    switch (sortBy) {
      case "most-funded":
        result.sort((a, b) => (b.moneyReceived as number) - (a.moneyReceived ?? 0))
        break
      case "newest":
        result.sort((a, b) => {
          // Handle cases where createdAt might be undefined
          if (!a.createdAt && !b.createdAt) return 0
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1

          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        break
      case "end-date":
        result.sort((a, b) => {
          const dateA = new Date(a.completionDate).getTime()
          const dateB = new Date(b.completionDate).getTime()
          return dateA - dateB
        })
        break
      default:
        break
    }

    

    setFilteredCampaigns(result)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, sortBy, originalCampaignList])

  // Apply pagination
  useEffect(() => {
    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage)
    setTotalPages(totalPages || 1) // Ensure at least 1 page even if no results

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedCampaigns(filteredCampaigns.slice(startIndex, endIndex))
  }, [filteredCampaigns, currentPage, itemsPerPage])

  // Calculate days remaining
  const calculateDaysRemaining = (dateString: string) => {
    const endDate = new Date(dateString)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Calculate funding percentage
  const calculateFundingPercentage = (received: number, goal: number) => {
    const percentage = (received / goal) * 100
    return Math.min(percentage, 100) // Cap at 100%
  }

  // Get unique categories from the campaign list
  const uniqueCategories = Array.from(new Set(originalCampaignList.map((campaign) => campaign.category)))

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setSortBy("newest")
    setCurrentPage(1)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = []

    // For small number of pages, show all page numbers
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
              className={
                currentPage === i ? "bg-blue-600 text-white hover:bg-blue-700" : "text-blue-700 hover:bg-blue-50"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
      return items
    }

    // For larger number of pages, show ellipsis
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
          className={currentPage === 1 ? "bg-blue-600 text-white hover:bg-blue-700" : "text-blue-700 hover:bg-blue-50"}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Add ellipsis or page numbers
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
            className={
              currentPage === i ? "bg-blue-600 text-white hover:bg-blue-700" : "text-blue-700 hover:bg-blue-50"
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={
              currentPage === totalPages ? "bg-blue-600 text-white hover:bg-blue-700" : "text-blue-700 hover:bg-blue-50"
            }
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Explore Campaigns</h1>
          <p className="text-blue-600 mb-8">Discover and support innovative projects from around the world</p>

          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  className="w-full pl-10 border-blue-200 focus-visible:ring-blue-400"
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px] border-blue-200 focus:ring-blue-400">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px] border-blue-200 focus:ring-blue-400">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-funded">Most Funded</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="end-date">End Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-blue-700">
                Showing {filteredCampaigns.length} of {originalCampaignList.length} campaigns
              </div>

              {(searchQuery || categoryFilter !== "all" || sortBy !== "most-funded") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {filteredCampaigns.length > 0 ? (
            <>
              <div className="space-y-6">
                {paginatedCampaigns.map((campaign) => {
                  const categoryColor = categoryColors[campaign.category] || defaultCategoryColor
                  const fundingPercentage = calculateFundingPercentage(campaign?.moneyReceived as number, 50)
                  const daysRemaining = calculateDaysRemaining(campaign.completionDate)

                  return (
                    <Card
                      key={campaign._id}
                      className="overflow-hidden border-blue-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 relative">
                          <Image
                            src={campaign?.campaignPicture}
                            alt={campaign.campaignName}
                            width={500}
                            height={300}
                            className="h-48 w-full object-cover md:h-full"
                          />
                          <Badge
                            className={`absolute top-3 left-3 ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}
                          >
                            {campaign.category}
                          </Badge>
                        </div>

                        <CardContent className="md:w-2/3 p-6">
                          <div className="mb-4">
                            <h2 className="text-xl font-bold text-blue-900 mb-2">{campaign.campaignName}</h2>
                            <p className="text-gray-600">{campaign.campaignDescription}</p>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-blue-800">
                                NLe{campaign?.moneyReceived?.toLocaleString()}
                              </span>
                              <span className="text-gray-500">of NLe{campaign.amountNeeded?.toLocaleString()}</span>
                            </div>
                            <div className="relative w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                              <div
                                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                                style={{ width: `${fundingPercentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-blue-700 font-medium">{fundingPercentage.toFixed(0)}% funded</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-4 gap-y-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                              <span>{daysRemaining} days left</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-blue-500" />
                              <span>{campaign.backers} backers</span>
                            </div>
                          </div>

                          <Link href={`/campaign/${campaign._id}`} className="block mt-4">
                            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">View Campaign</Button>
                          </Link>
                        </CardContent>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`text-blue-700 hover:bg-blue-50 ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`text-blue-700 hover:bg-blue-50 ${currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center text-sm text-blue-600 mt-2">
                  Page {currentPage} of {totalPages} • Showing {paginatedCampaigns.length} of {filteredCampaigns.length}{" "}
                  campaigns
                </div>
              </div>
            </>
          ) : (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800 text-center py-8">
                No campaigns match your current filters. Try adjusting your search criteria or
                <Button variant="link" onClick={resetFilters} className="text-blue-600 font-medium px-1">
                  reset all filters
                </Button>
                to see all campaigns.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  )
}

