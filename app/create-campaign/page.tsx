"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, Plus, ArrowLeft, ArrowRight, Check, Camera, FileText, Tag, Eye } from "lucide-react"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api/api"
import {toast, Toaster} from "react-hot-toast"
import { useEffect } from "react"

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
  const [limits, setLimits] = useState<{ minGoal: number; maxGoal: number; maxDays: number }>({ minGoal: 100000, maxGoal: 10000000, maxDays: 365 })
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    fundingGoal: "",
    shortDescription: "",
    location: "",
    campaignEndDate: "",
    image: null as File | null,
    imagePreview: "",
    tags: [] as string[],
  })
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [saveStamp, setSaveStamp] = useState<string>("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data?.ok && data?.data?.config?.limits) {
          setLimits({
            minGoal: Number(data.data.config.limits.minCampaignGoal ?? 100000),
            maxGoal: Number(data.data.config.limits.maxCampaignGoal ?? 10000000),
            maxDays: Number(data.data.config.limits.campaignDurationLimit ?? 365),
          })
        }
      } catch {}
    }
    loadSettings()
    // Load draft from localStorage
    try {
      const raw = localStorage.getItem('createCampaignDraft')
      const stepRaw = localStorage.getItem('createCampaignStep')
      if (raw) {
        const parsed = JSON.parse(raw)
        // Avoid overwriting if empty
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            // Do not restore File object
            image: null,
            imagePreview: parsed.imagePreview || "",
          }))
        }
      }
      if (stepRaw) {
        const stepNum = Number(stepRaw)
        if (!Number.isNaN(stepNum) && stepNum >= 1 && stepNum <= steps.length) setCurrentStep(stepNum)
      }
    } catch {}
  }, [])

  // Debounced autosave to localStorage
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const payload = { ...formData, image: undefined } // avoid File in storage
        localStorage.setItem('createCampaignDraft', JSON.stringify(payload))
        localStorage.setItem('createCampaignStep', String(currentStep))
        setSaveStamp(new Date().toLocaleTimeString())
      } catch {}
    }, 500)
    return () => clearTimeout(t)
  }, [formData, currentStep])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = "Campaign title is required"
        if (!formData.category) newErrors.category = "Please select a category"
        if (!formData.fundingGoal || Number(formData.fundingGoal) < limits.minGoal) {
          newErrors.fundingGoal = `Funding goal must be at least ${new Intl.NumberFormat('en-SL', { style: 'currency', currency: 'SLE', maximumFractionDigits: 0 }).format(limits.minGoal)}`
        }
        if (Number(formData.fundingGoal) > limits.maxGoal) {
          newErrors.fundingGoal = `Funding goal must not exceed ${new Intl.NumberFormat('en-SL', { style: 'currency', currency: 'SLE', maximumFractionDigits: 0 }).format(limits.maxGoal)}`
        }
        // duration limit
        if (formData.campaignEndDate) {
          const now = new Date()
          const end = new Date(formData.campaignEndDate)
          const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          if (diffDays < 1) newErrors.campaignEndDate = "End date must be at least 1 day from today"
          if (diffDays > limits.maxDays) newErrors.campaignEndDate = `End date must be within ${limits.maxDays} days`
        }
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.campaignEndDate) newErrors.campaignEndDate = "End date is required"

        // Team members validation removed per simplified form
        break
      case 2:
        if (!formData.image) {
          newErrors.image = "An image is required"
        }
        break
      case 3:
        if (!formData.shortDescription.trim()) newErrors.shortDescription = "Short description is required"
        if (formData.shortDescription.length > 200)
          newErrors.shortDescription = "Description must be under 200 characters"
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
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "Only JPG, PNG, and GIF files are allowed" }))
        return
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, image: "File size must be less than 5MB" }))
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: previewUrl,
      }))

      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }))
      }
    }
  }

  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview)
    }
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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

    const submitData = new FormData()
    submitData.append("title", formData.title)
    submitData.append("category", formData.category)
    submitData.append("fundingGoal", formData.fundingGoal)
    submitData.append("shortDescription", formData.shortDescription)
    submitData.append("location", formData.location)
    submitData.append("campaignEndDate", formData.campaignEndDate)
    submitData.append("tags", JSON.stringify(formData.tags))


    if (formData.image) {
      submitData.append("image", formData.image)
    }

    try {
      await api.createCampaign(submitData)
      toast.success("Campaign created successfully")
      router.push('/dashboard')
    } catch (error: any) {
      console.error("Error creating campaign:", error)
      const msg = (error && error.message) || 'Failed to create campaign'
      toast.error(msg)
      // Try to surface field errors if provided
      const details = error?.details || error?.error || null
      if (details && typeof details === 'object') {
        const newErrors: Record<string, string> = {}
        // Map common zod error paths to fields
        const possible = ['title','category','fundingGoal','shortDescription','location','campaignEndDate','image']
        try {
          // If details is a zod format tree, pick first-level keys
          for (const key of possible) {
            const node = details[key]
            if (node && node._errors && node._errors.length) {
              newErrors[key] = node._errors[0]
            }
          }
        } catch {}
        if (Object.keys(newErrors).length > 0) setErrors(prev => ({...prev, ...newErrors}))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen py-4 sm:py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Create Your Campaign
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Tell your story and start raising funds for your cause
          </p>
          {saveStamp && (
            <p className="text-xs text-slate-500 mt-2">Draft saved at {saveStamp}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />

          {/* Step Indicators */}
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {steps.map((step) => {
              const StepIcon = step.icon
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id

              return (
                <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : isCurrent
                          ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg"
                          : "bg-white text-slate-400 border-2 border-slate-200"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs sm:text-sm font-medium ${isCurrent ? "text-indigo-600" : "text-slate-600"}`}>
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
        <Card className="mb-6 sm:mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                <p className="font-semibold mb-1">Please fix the following:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {Array.from(new Set(Object.values(errors))).map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Basic Information
                  </CardTitle>
                  <p className="text-slate-600">Let&apos;s start with the essential details of your campaign</p>
                </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Title *</label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.title ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-blue-300"
                      }`}
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
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.category ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-blue-300"
                      }`}
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
                      min={limits.minGoal}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.fundingGoal ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-blue-300"
                      }`}
                      placeholder={`e.g., ${new Intl.NumberFormat('en-SL', { style: 'currency', currency: 'SLE', maximumFractionDigits: 0 }).format(limits.minGoal * 5)}` }
                      value={formData.fundingGoal}
                      onChange={(e) => {
                        setFormData({ ...formData, fundingGoal: e.target.value })
                        if (errors.fundingGoal) setErrors((prev) => ({ ...prev, fundingGoal: "" }))
                      }}
                    />
                    {errors.fundingGoal && <p className="text-red-500 text-sm mt-1">{errors.fundingGoal}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.location ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-blue-300"
                      }`}
                      placeholder="e.g., Freetown, Western Area"
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value })
                        if (errors.location) setErrors((prev) => ({ ...prev, location: "" }))
                      }}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Campaign End Date *</label>
                    <input
                      type="date"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.campaignEndDate ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-blue-300"
                      }`}
                      min={new Date(Date.now() + 24*60*60*1000).toISOString().split("T")[0]}
                      value={formData.campaignEndDate}
                      onChange={(e) => {
                        setFormData({ ...formData, campaignEndDate: e.target.value })
                        if (errors.campaignEndDate) setErrors((prev) => ({ ...prev, campaignEndDate: "" }))
                      }}
                    />
                    {errors.campaignEndDate && <p className="text-red-500 text-sm mt-1">{errors.campaignEndDate}</p>}
                  </div>


                </div>
              </div>
            )}

            {/* Step 2: Campaign Image */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Campaign Media
                  </CardTitle>
                  <p className="text-slate-600">Add a compelling image to represent your campaign</p>
                </CardHeader>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image *</label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200 ${
                      errors.image
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30"
                    }`}
                  >
                    {formData.imagePreview ? (
                      <div className="relative">
                        <Image
                          src={formData.imagePreview || "/placeholder.svg"}
                          alt="Campaign preview"
                          width={600}
                          height={400}
                          className="mx-auto mb-4 rounded-lg max-h-64 object-contain"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-4 text-lg">Click to select an image file</p>
                        <p className="text-slate-500 text-sm mb-4">Supported formats: JPG, PNG, GIF (Max 50MB)</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      ref={fileInputRef}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      {formData.imagePreview ? "Change Image" : "Choose Image"}
                    </label>
                  </div>
                  {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Campaign Story */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Tell Your Story
                  </CardTitle>
                  <p className="text-slate-600">Share the compelling story behind your campaign</p>
                </CardHeader>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Short Description *</label>
                    <textarea
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.shortDescription
                          ? "border-red-500 bg-red-50"
                          : "border-slate-300 hover:border-blue-300"
                      }`}
                      placeholder="Write a brief, compelling summary of your campaign (max 200 characters)"
                      maxLength={200}
                      value={formData.shortDescription}
                      onChange={(e) => {
                        setFormData({ ...formData, shortDescription: e.target.value })
                        if (errors.shortDescription) setErrors((prev) => ({ ...prev, shortDescription: "" }))
                      }}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.shortDescription && <p className="text-red-500 text-sm">{errors.shortDescription}</p>}
                      <p className="text-sm text-slate-500 ml-auto">
                        {formData.shortDescription.length}/200 characters
                      </p>
                    </div>
                  </div>

                  {/* Removed Problem, Solution, Impact fields as requested */}
                </div>
              </div>
            )}

            {/* Step 4: Tags */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Tags & Keywords
                  </CardTitle>
                  <p className="text-slate-600">Add tags to help people discover your campaign</p>
                </CardHeader>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Add Tags (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                      placeholder="Add a relevant tag (e.g., education, health, community)"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-0 hover:from-blue-700 hover:to-emerald-700 px-6"
                    >
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
                          className="bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-800 px-3 py-1 text-sm flex items-center border border-blue-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.tags.length === 0 && (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
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
                  <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Review Your Campaign
                  </CardTitle>
                  <p className="text-slate-600">Please review all details before submitting</p>
                </CardHeader>

                <div className="space-y-6">
                  {/* Basic Info Review */}
                  <Card className="border-2 border-slate-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
                      <CardTitle className="text-lg text-blue-900">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Title</p>
                          <p className="text-slate-900 font-medium">{formData.title}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Category</p>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">{formData.category}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Funding Goal</p>
                          <p className="text-slate-900 font-semibold text-lg">
                            {Number(formData.fundingGoal).toLocaleString()} SLL
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Location</p>
                          <p className="text-slate-900">{formData.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">End Date</p>
                          <p className="text-slate-900">{new Date(formData.campaignEndDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                  {/* Image Review */}
                  <Card className="border-2 border-slate-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
                      <CardTitle className="text-lg text-blue-900">Campaign Image</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {formData.imagePreview ? (
                        <div className="relative max-w-lg mx-auto">
                          <Image
                            src={formData.imagePreview || "/placeholder.svg"}
                            alt="Campaign preview"
                            width={600}
                            height={400}
                            className="rounded-lg object-contain max-h-64 w-full border border-slate-200"
                          />
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-4">No image uploaded</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Story Review */}
                  <Card className="border-2 border-slate-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
                      <CardTitle className="text-lg text-blue-900">Campaign Story</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Short Description</p>
                        <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{formData.shortDescription}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags Review */}
                  {formData.tags.length > 0 && (
                    <Card className="border-2 border-slate-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50">
                      <CardTitle className="text-lg text-blue-900">Tags</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center w-full sm:w-auto order-2 sm:order-1 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
            <Button type="button" variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => { localStorage.removeItem('createCampaignDraft'); localStorage.removeItem('createCampaignStep'); setSaveStamp("") }}
              className="w-full sm:w-auto"
            >
              Clear Draft
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 w-full sm:w-auto"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="w-full sm:w-auto"
                >
                  Preview
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 w-full sm:w-auto"
                >
                  {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Campaign Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image */}
              <div className="bg-slate-50 rounded-lg border p-3">
                {formData.imagePreview ? (
                  <Image src={formData.imagePreview || "/placeholder.svg"} alt="Preview" width={800} height={450} className="rounded-md w-full h-auto object-contain" />
                ) : (
                  <div className="text-center text-slate-500 py-10">No image selected</div>
                )}
              </div>
              {/* Content */}
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900">{formData.title || "Untitled Campaign"}</h4>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {formData.category && <Badge className="bg-blue-100 text-blue-800 border-blue-200">{formData.category}</Badge>}
                  <span className="text-slate-600">Goal: {formData.fundingGoal ? Number(formData.fundingGoal).toLocaleString() : 0} SLL</span>
                  {formData.campaignEndDate && (
                    <span className="text-slate-600">Ends: {new Date(formData.campaignEndDate).toLocaleDateString()}</span>
                  )}
                  {formData.location && <span className="text-slate-600">Location: {formData.location}</span>}
                </div>
                {formData.shortDescription && (
                  <p className="text-slate-700 bg-slate-50 border rounded-md p-3">{formData.shortDescription}</p>
                )}
                {formData.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((t, i) => (
                      <Badge key={`${t}-${i}`} className="bg-blue-50 text-blue-700 border-blue-200">{t}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-green-600 to-emerald-600">
                  {isSubmitting ? "Creating..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster
      position="top-center"
      toastOptions={{
        duration:3000
      }}
      />
    </div>
  )
}
