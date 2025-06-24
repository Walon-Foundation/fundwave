"use client"

import { useState } from "react"
import { Search, Upload, Trash2, Download, Eye, Grid, List, ImageIcon, Video, FileText } from "lucide-react"
import { Card, CardContent } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"

const mockMediaFiles = [
  {
    id: "1",
    name: "campaign-hero-image.jpg",
    type: "image",
    size: "2.4 MB",
    uploadedAt: "2024-01-20",
    uploadedBy: "Admin",
    url: "/placeholder.svg?height=200&width=300",
    dimensions: "1920x1080",
    usedIn: ["Clean Water Campaign", "Homepage"],
  },
  {
    id: "2",
    name: "success-story-video.mp4",
    type: "video",
    size: "15.7 MB",
    uploadedAt: "2024-01-19",
    uploadedBy: "Content Team",
    url: "/placeholder.svg?height=200&width=300",
    duration: "2:34",
    usedIn: ["About Page"],
  },
  {
    id: "3",
    name: "terms-of-service.pdf",
    type: "document",
    size: "156 KB",
    uploadedAt: "2024-01-18",
    uploadedBy: "Legal Team",
    url: "/placeholder.svg?height=200&width=300",
    pages: 12,
    usedIn: ["Terms Page"],
  },
  {
    id: "4",
    name: "donor-testimonial.jpg",
    type: "image",
    size: "1.8 MB",
    uploadedAt: "2024-01-17",
    uploadedBy: "Marketing",
    url: "/placeholder.svg?height=200&width=300",
    dimensions: "1200x800",
    usedIn: ["Testimonials"],
  },
]

export default function MediaLibraryPage() {
  const [files, setFiles] = useState(mockMediaFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || file.type === typeFilter
    return matchesSearch && matchesType
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-5 h-5 text-blue-500" />
      case "video":
        return <Video className="w-5 h-5 text-purple-500" />
      case "document":
        return <FileText className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-slate-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      case "document":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const totalSize = files.reduce((sum, file) => {
    const size = Number.parseFloat(file.size.split(" ")[0])
    const unit = file.size.split(" ")[1]
    return sum + (unit === "MB" ? size : size / 1024)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Media Library</h1>
          <p className="text-slate-600">Manage images, videos, and documents</p>
        </div>
        <Button className="bg-gradient-to-r from-sky-500 to-indigo-600">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Files</p>
                <p className="text-2xl font-bold text-slate-900">{files.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Images</p>
                <p className="text-2xl font-bold text-blue-600">{files.filter((f) => f.type === "image").length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Videos</p>
                <p className="text-2xl font-bold text-purple-600">{files.filter((f) => f.type === "video").length}</p>
              </div>
              <Video className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Storage Used</p>
                <p className="text-2xl font-bold text-slate-900">{totalSize.toFixed(1)} MB</p>
              </div>
              <Download className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
              </select>
              <div className="flex border border-slate-300 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Files */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-video bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                  {file.type === "image" ? (
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      {getFileIcon(file.type)}
                      <p className="text-xs text-slate-500 mt-2">{file.type.toUpperCase()}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-slate-900 truncate">{file.name}</h3>
                    <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                  </div>

                  <div className="text-sm text-slate-600">
                    <p>{file.size}</p>
                    <p>By {file.uploadedBy}</p>
                    <p>{new Date(file.uploadedAt).toLocaleDateString()}</p>
                  </div>

                  {file.usedIn.length > 0 && (
                    <div className="text-xs text-slate-500">Used in: {file.usedIn.join(", ")}</div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Uploaded By</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getFileIcon(file.type)}
                          <span className="ml-3 font-medium text-slate-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{file.size}</td>
                      <td className="py-3 px-4 text-slate-600">{file.uploadedBy}</td>
                      <td className="py-3 px-4 text-slate-600">{new Date(file.uploadedAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
