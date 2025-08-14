"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Eye, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

// Mock updates data
const mockUpdates = [
  {
    id: "1",
    title: "Construction Progress Update",
    content:
      "Great news! We've completed 60% of the water pump installation. The community is excited to see the progress.",
    images: ["/placeholder.svg?height=200&width=300"],
    date: "2024-01-20",
    views: 234,
    comments: 12,
    published: true,
  },
  {
    id: "2",
    title: "Permits Approved",
    content: "All necessary permits have been approved by local authorities. We can now proceed with the next phase.",
    images: [],
    date: "2024-01-15",
    views: 189,
    comments: 8,
    published: true,
  },
  {
    id: "3",
    title: "Draft: Equipment Delivery",
    content: "The water pump equipment has arrived and is ready for installation...",
    images: ["/placeholder.svg?height=200&width=300"],
    date: "2024-01-22",
    views: 0,
    comments: 0,
    published: false,
  },
]

export default function CampaignUpdatesPage() {
  const param = useParams<{id:string}>()
  const [updates, setUpdates] = useState(mockUpdates)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    content: "",
    images: [] as string[],
  })

  const handleCreateUpdate = () => {
    if (!newUpdate.title.trim() || !newUpdate.content.trim()) return

    const update = {
      id: Date.now().toString(),
      ...newUpdate,
      date: new Date().toISOString().split("T")[0],
      views: 0,
      comments: 0,
      published: true,
    }

    setUpdates([update, ...updates])
    setNewUpdate({ title: "", content: "", images: [] })
    setShowCreateForm(false)
  }

  const handleDeleteUpdate = (updateId: string) => {
    if (confirm("Are you sure you want to delete this update?")) {
      setUpdates(updates.filter((u) => u.id !== updateId))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=200&width=300&text=Update${index + 1}`,
      )
      setNewUpdate((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 3),
      }))
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/campaigns/${param.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Campaign Updates</h1>
              <p className="text-xl text-slate-600">Keep your supporters informed about your progress</p>
            </div>
            <button onClick={() => setShowCreateForm(true)} className="btn-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              New Update
            </button>
          </div>
        </div>

        {/* Create Update Form */}
        {showCreateForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Create New Update</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Update Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter update title"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Update Content</label>
                <textarea
                  rows={6}
                  className="input"
                  placeholder="Share your progress, challenges, or achievements..."
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Images (Optional)</label>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="input" />
                {newUpdate.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {newUpdate.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Update image ${index + 1}`}
                        width={200}
                        height={150}
                        className="rounded-lg object-cover w-full h-24"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button onClick={() => setShowCreateForm(false)} className="btn-outline">
                  Cancel
                </button>
                <button onClick={handleCreateUpdate} className="btn-primary">
                  Publish Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Updates List */}
        <div className="space-y-6">
          {updates.map((update) => (
            <div key={update.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">{update.title}</h3>
                    {!update.published && (
                      <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(update.date).toLocaleDateString()}</span>
                    {update.published && (
                      <>
                        <span className="mx-2">•</span>
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{update.views} views</span>
                        <span className="mx-2">•</span>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{update.comments} comments</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-800" title="Edit Update">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUpdate(update.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Update"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="prose max-w-none mb-4">
                <p className="text-slate-700">{update.content}</p>
              </div>

              {update.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {update.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Update image ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-32"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {updates.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No updates yet</h3>
              <p className="text-slate-600 mb-4">
                Keep your supporters engaged by sharing regular updates about your campaign progress.
              </p>
              <button onClick={() => setShowCreateForm(true)} className="btn-primary">
                Create Your First Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
