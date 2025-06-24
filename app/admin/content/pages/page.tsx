"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye, Globe } from "lucide-react"

const mockPages = [
  {
    id: "1",
    title: "Terms of Service",
    slug: "terms",
    status: "published",
    lastModified: "2024-01-20",
    author: "Admin",
    views: 1250,
  },
  {
    id: "2",
    title: "Privacy Policy",
    slug: "privacy",
    status: "published",
    lastModified: "2024-01-20",
    author: "Admin",
    views: 980,
  },
  {
    id: "3",
    title: "Help Center",
    slug: "help",
    status: "published",
    lastModified: "2024-01-19",
    author: "Admin",
    views: 2340,
  },
  {
    id: "4",
    title: "About Us",
    slug: "about",
    status: "published",
    lastModified: "2024-01-18",
    author: "Admin",
    views: 1560,
  },
]

export default function ContentPagesPage() {
  const [pages, setPages] = useState(mockPages)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Content Pages</h1>
          <p className="text-slate-600">Manage static pages and content</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Page</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Views</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Last Modified</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => (
                <tr key={page.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{page.title}</div>
                      <div className="text-sm text-slate-600">/{page.slug}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">{page.views.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="text-slate-900">{new Date(page.lastModified).toLocaleDateString()}</div>
                      <div className="text-slate-500">by {page.author}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-indigo-600 hover:text-indigo-800" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800" title="Visit Page">
                        <Globe className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
