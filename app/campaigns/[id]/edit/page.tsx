"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Upload, X, Plus, Save, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

// Mock campaign data
const mockCampaign = {
  id: "1",
  title: "Clean Water for Makeni Community",
  category: "Community",
  targetAmount: "5000000",
  description: "Help us build a clean water system for 500 families in Makeni",
  fullDescription: "Our community has been struggling with water scarcity for years...",
  location: "Makeni, Northern Province",
  endDate: "2024-06-15",
  images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  tags: ["water", "community", "health"],
}

export default function EditCampaignPage() {
  const params = useParams<{id:string}>()
  const [formData, setFormData] = useState(mockCampaign)
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=200&width=300&text=Image${formData.images.length + index + 1}`,
      )
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5),
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock API call
    console.log("Updating campaign:", formData)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Campaign updated successfully!")
    router.push(`/campaigns/${(params).id}`)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/campaigns/${params.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Edit Campaign</h1>
          <p className="text-xl text-slate-600">Update your campaign details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Basic Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Title *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                <select
                  required
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Funding Goal (SLL) *</label>
                <input
                  type="number"
                  required
                  min="100000"
                  className="input"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Campaign End Date *</label>
                <input
                  type="date"
                  required
                  className="input"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Campaign Images */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Campaign Images</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload Images (Max 5)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">Drag and drop images here, or click to select files</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="btn-primary cursor-pointer">
                  Choose Images
                </label>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Campaign image ${index + 1}`}
                      width={200}
                      height={150}
                      className="rounded-lg object-cover w-full h-32"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaign Story */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Campaign Story</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Short Description *</label>
                <textarea
                  required
                  rows={3}
                  className="input"
                  placeholder="Write a brief, compelling summary of your campaign"
                  maxLength={200}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <p className="text-sm text-slate-500 mt-1">{formData.description.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Campaign Story *</label>
                <textarea
                  required
                  rows={10}
                  className="input"
                  placeholder="Tell the full story of your campaign..."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Tags</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Add Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <button type="button" onClick={addTag} className="btn-outline flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link href={`/campaigns/${params.id}`} className="btn-outline px-8 py-3">
              Cancel
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-3 flex items-center">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Updating..." : "Update Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
