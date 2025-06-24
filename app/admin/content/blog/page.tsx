"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"

const mockBlogPosts = [
  {
    id: "1",
    title: "How to Create a Successful Fundraising Campaign",
    slug: "successful-fundraising-campaign",
    author: "Admin Team",
    status: "published",
    publishedAt: "2024-01-20",
    views: 1250,
    excerpt: "Learn the essential steps to create a compelling fundraising campaign that resonates with donors...",
    featured: true,
  },
  {
    id: "2",
    title: "Success Stories: Clean Water Project in Makeni",
    slug: "clean-water-project-success",
    author: "Content Team",
    status: "published",
    publishedAt: "2024-01-18",
    views: 890,
    excerpt: "Read about how the community came together to bring clean water to over 500 families...",
    featured: false,
  },
  {
    id: "3",
    title: "Understanding Mobile Money Payments in Sierra Leone",
    slug: "mobile-money-payments-guide",
    author: "Tech Team",
    status: "draft",
    publishedAt: null,
    views: 0,
    excerpt: "A comprehensive guide to mobile money payment options available on FundWaveSL...",
    featured: false,
  },
  {
    id: "4",
    title: "Building Trust in Online Fundraising",
    slug: "building-trust-online-fundraising",
    author: "Admin Team",
    status: "published",
    publishedAt: "2024-01-15",
    views: 567,
    excerpt: "Explore the key factors that build donor confidence in online fundraising platforms...",
    featured: false,
  },
]

export default function BlogPostsPage() {
  const [posts, setPosts] = useState(mockBlogPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Posts</h1>
          <p className="text-slate-600">Manage blog content and articles</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Posts</p>
                <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
              </div>
              <Edit className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {posts.filter((p) => p.status === "published").length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{posts.filter((p) => p.status === "draft").length}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Views</p>
                <p className="text-2xl font-bold text-slate-900">
                  {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  {post.featured && (
                    <Badge className="mt-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white">Featured</Badge>
                  )}
                </div>
                <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>

              <div className="space-y-2 text-sm text-slate-500 mb-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                {post.publishedAt && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                )}
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {post.views.toLocaleString()} views
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  {post.status === "published" ? "View" : "Edit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
