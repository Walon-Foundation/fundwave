"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X, Plus, ArrowLeft, ArrowRight, Check, Camera, FileText, Tag, Eye } from "lucide-react"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"

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

const steps = [
  { id: 1, title: "Basic Info", icon: FileText, description: "Campaign details" },
  { id: 2, title: "Media", icon: Camera, description: "Images & videos" },
  { id: 3, title: "Story", icon: FileText, description: "Tell your story" },
  { id: 4, title: "Tags", icon: Tag, description: "Add tags" },
  { id: 5, title: "Review", icon: Eye, description: "Final review" },
]

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    targetAmount: "",
    description: "",
    fullDescription: "",
    location: "",
    endDate: "",
    images: [] as string[],
    tags: [] as string[],
  })
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Campaign title is required"
        if (!formData.category) newErrors.category = "Please select a category"
        if (!formData.targetAmount || Number(formData.targetAmount) < 100000) {
          newErrors.targetAmount = "Target amount must be at least 100,000 SLL"
        }
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.endDate) newErrors.endDate = "End date is required"
        break
      case 2:
        if (formData.images.length === 0) {
          newErrors.images = "At least one image is required"
        }
        break
      case 3:
        if (!formData.description.trim()) newErrors.description = "Short description is required"
        if (!formData.fullDescription.trim()) newErrors.fullDescription = "Full story is required"
        if (formData.description.length > 200) newErrors.description = "Description must be under 200 characters"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

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
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }))
      }
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

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    console.log("Creating campaign:", formData)

    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Campaign created successfully! It will be reviewed before going live.")
    window.location.href = "/dashboard"
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen py-8 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Create Your Campaign</h1>
          <p className="text-xl text-slate-600">Tell your story and start raising funds for your cause</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isCurrent ? "text-indigo-600" : "text-slate-600"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 hidden sm:block">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Steps */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Basic Information</CardTitle>
                  <p className="text-slate-600">Let's start with the essential details of your campaign</p>
                </CardHeader>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Title *</label>
                    <input
                      type="text"
                      className={`input ${errors.title ? "border-red-500" : ""}`}
                      placeholder="Give your campaign a clear, compelling title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value })
                        if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
                      }}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                    <select
                      className={`input ${errors.category ? "border-red-500" : ""}`}
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({ ...formData, category: e.target.value })
                        if (errors.category) setErrors((prev) => ({ ...prev, category: "" }))
                      }}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Funding Goal (SLL) *</label>
                    <input
                      type="number"
                      min="100000"
                      className={`input ${errors.targetAmount ? "border-red-500" : ""}`}
                      placeholder="e.g., 5,000,000"
                      value={formData.targetAmount}
                      onChange={(e) => {
                        setFormData({ ...formData, targetAmount: e.target.value })
                        if (errors.targetAmount) setErrors((prev) => ({ ...prev, targetAmount: "" }))
                      }}
                    />
                    {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                    <input
                      type="text"
                      className={`input ${errors.location ? "border-red-500" : ""}`}
                      placeholder="e.g., Freetown, Western Area"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value })
                        if (errors.location) setErrors((prev) => ({ ...prev, location: "" }))
                      }}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Campaign End Date *</label>
                    <input
                      type="date"
                      className={`input ${errors.endDate ? "border-red-500" : ""}`}
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.endDate}
                      onChange={(e) => {
                        setFormData({ ...formData, endDate: e.target.value })
                        if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: "" }))
                      }}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Campaign Images */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Campaign Media</CardTitle>
                  <p className="text-slate-600">Add compelling images to tell your story visually</p>
                </CardHeader>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Images (Max 5) *</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      errors.images ? "border-red-300 bg-red-50" : "border-slate-300 hover:border-indigo-400"
                    }`}
                  >
                    <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4 text-lg">Drag and drop images here, or click to select files</p>
                    <p className="text-slate-500 text-sm mb-4">Supported formats: JPG, PNG, GIF (Max 5MB each)</p>
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
                  {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-4">
                      Uploaded Images ({formData.images.length}/5)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Campaign image ${index + 1}`}
                            width={200}
                            height={150}
                            className="rounded-lg object-cover w-full h-32 border-2 border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && <Badge className="absolute bottom-2 left-2 bg-indigo-600">Main Image</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Campaign Story */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Tell Your Story</CardTitle>
                  <p className="text-slate-600">Share the compelling story behind your campaign</p>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Short Description *</label>
                    <textarea
                      rows={3}
                      className={`input ${errors.description ? "border-red-500" : ""}`}
                      placeholder="Write a brief, compelling summary of your campaign (max 200 characters)"
                      maxLength={200}
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value })
                        if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
                      }}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                      <p className="text-sm text-slate-500 ml-auto">{formData.description.length}/200 characters</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Campaign Story *</label>
                    <textarea
                      rows={12}
                      className={`input ${errors.fullDescription ? "border-red-500" : ""}`}
                      placeholder="Tell the full story of your campaign. Include:
• The problem you're solving
• Your solution and approach  
• The impact donations will make
• Why people should support you
• Your background and credibility"
                      value={formData.fullDescription}
                      onChange={(e) => {
                        setFormData({ ...formData, fullDescription: e.target.value })
                        if (errors.fullDescription) setErrors((prev) => ({ ...prev, fullDescription: "" }))
                      }}
                    />
                    {errors.fullDescription && <p className="text-red-500 text-sm mt-1">{errors.fullDescription}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Tags */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Tags & Keywords</CardTitle>
                  <p className="text-slate-600">Add tags to help people discover your campaign</p>
                </CardHeader>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Add Tags (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Add a relevant tag (e.g., education, health, community)"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline" className="flex items-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Tags help people find your campaign when searching. Use relevant keywords.
                  </p>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-3">Your Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 text-sm flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.tags.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Tag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No tags added yet. Tags are optional but recommended for better discoverability.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Review Your Campaign</CardTitle>
                  <p className="text-slate-600">Please review all details before submitting</p>
                </CardHeader>

                <div className="space-y-6">
                  {/* Basic Info Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Title</p>
                          <p className="text-slate-900">{formData.title}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Category</p>
                          <Badge variant="outline">{formData.category}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Target Amount</p>
                          <p className="text-slate-900 font-semibold">
                            {Number(formData.targetAmount).toLocaleString()} SLL
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Location</p>
                          <p className="text-slate-900">{formData.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">End Date</p>
                          <p className="text-slate-900">{new Date(formData.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Images Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Campaign Images ({formData.images.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Campaign image ${index + 1}`}
                              width={100}
                              height={75}
                              className="rounded object-cover w-full h-16"
                            />
                            {index === 0 && (
                              <Badge className="absolute -top-1 -right-1 text-xs bg-indigo-600">Main</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Story Review */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Campaign Story</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Short Description</p>
                        <p className="text-slate-900">{formData.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Full Story</p>
                        <div className="bg-slate-50 p-4 rounded-lg max-h-32 overflow-y-auto">
                          <p className="text-slate-900 whitespace-pre-wrap">{formData.fullDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags Review */}
                  {formData.tags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="flex items-center">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
