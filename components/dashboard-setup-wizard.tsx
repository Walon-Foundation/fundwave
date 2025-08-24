"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

interface WizardStep {
  id: string
  title: string
  description: string
  target: string
  content: React.ReactNode
  position: "top" | "bottom" | "left" | "right" | "center"
}

interface DashboardSetupWizardProps {
  isFirstTime: boolean
  onComplete: () => void
  onSkip: () => void
}

export default function DashboardSetupWizard({ isFirstTime, onComplete, onSkip }: DashboardSetupWizardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)

  const wizardSteps: WizardStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your Dashboard! 🎉",
      description: "Let's take a quick tour to help you navigate your creator dashboard effectively.",
      target: "",
      position: "center",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Welcome to FundWaveSL!</h3>
          <p className="text-slate-600">
            This quick tour will show you all the powerful features available in your creator dashboard. It will take
            about 2 minutes to complete.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>📊 Analytics</span>
            <span>💰 Campaign Management</span>
            <span>👥 Donor Insights</span>
            <span>📈 Performance Tracking</span>
          </div>
        </div>
      ),
    },
    {
      id: "stats-overview",
      title: "Your Performance Overview",
      description: "These cards show your key metrics at a glance - total raised, donors, views, and active campaigns.",
      target: ".stats-overview",
      position: "bottom",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">💰 Total Raised</Badge>
            <span className="text-sm text-slate-600">Your lifetime fundraising amount</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">👥 Total Donors</Badge>
            <span className="text-sm text-slate-600">People who have supported your causes</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">👁️ Total Views</Badge>
            <span className="text-sm text-slate-600">How many people have seen your campaigns</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">📈 Active Campaigns</Badge>
            <span className="text-sm text-slate-600">Currently running fundraising campaigns</span>
          </div>
        </div>
      ),
    },
    {
      id: "navigation-tabs",
      title: "Dashboard Navigation",
      description: "Use these tabs to switch between different sections of your dashboard.",
      target: ".dashboard-tabs",
      position: "bottom",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">📊 Overview</h4>
              <p className="text-xs text-blue-700">Recent activity and quick stats</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">🎯 Campaigns</h4>
              <p className="text-xs text-green-700">Manage all your campaigns</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">📈 Analytics</h4>
              <p className="text-xs text-purple-700">Detailed performance insights</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">🔔 Notifications</h4>
              <p className="text-xs text-orange-700">Stay updated with activities</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "create-campaign",
      title: "Create New Campaign",
      description:
        "Click this button to start a new fundraising campaign. It will guide you through a step-by-step process.",
      target: ".create-campaign-btn",
      position: "left",
      content: (
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">✨ Campaign Creation Process</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs">1</span>
                <span>Basic Information</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs">2</span>
                <span>Upload Images & Media</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs">3</span>
                <span>Tell Your Story</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center text-xs">4</span>
                <span>Review & Publish</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "recent-activity",
      title: "Recent Activity Feed",
      description: "Stay updated with real-time activities on your campaigns - donations, comments, shares, and more.",
      target: ".recent-activity",
      position: "right",
      content: (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">📱 Activity Types</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <span className="text-green-600">💰</span>
              <span className="text-sm">New donations received</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <span className="text-blue-600">💬</span>
              <span className="text-sm">Comments on campaigns</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
              <span className="text-purple-600">📤</span>
              <span className="text-sm">Campaign shares</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
              <span className="text-orange-600">📝</span>
              <span className="text-sm">Campaign updates</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "quick-actions",
      title: "Quick Actions Panel",
      description: "Access frequently used features quickly from this sidebar panel.",
      target: ".quick-actions",
      position: "left",
      content: (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">⚡ Quick Access</h4>
          <div className="space-y-2">
            <div className="p-2 bg-indigo-50 rounded flex items-center gap-2">
              <span>🎯</span>
              <span className="text-sm">Create New Campaign</span>
            </div>
            <div className="p-2 bg-green-50 rounded flex items-center gap-2">
              <span>📊</span>
              <span className="text-sm">View Analytics</span>
            </div>
            <div className="p-2 bg-blue-50 rounded flex items-center gap-2">
              <span>📥</span>
              <span className="text-sm">Export Data</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <h5 className="font-medium text-yellow-900 text-sm">💡 Pro Tips</h5>
            <p className="text-xs text-yellow-700 mt-1">
              Regular updates and social sharing can increase your campaign success by up to 40%!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "campaigns-table",
      title: "Campaign Management",
      description: "View and manage all your campaigns in one place. Edit, pause, or analyze performance.",
      target: ".campaigns-table",
      position: "top",
      content: (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">🎯 Campaign Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-blue-50 rounded text-center">
              <span className="text-blue-600">👁️</span>
              <p className="text-xs text-blue-700">View Campaign</p>
            </div>
            <div className="p-2 bg-green-50 rounded text-center">
              <span className="text-green-600">✏️</span>
              <p className="text-xs text-green-700">Edit Details</p>
            </div>
            <div className="p-2 bg-purple-50 rounded text-center">
              <span className="text-purple-600">📊</span>
              <p className="text-xs text-purple-700">View Analytics</p>
            </div>
            <div className="p-2 bg-orange-50 rounded text-center">
              <span className="text-orange-600">⏸️</span>
              <p className="text-xs text-orange-700">Pause/Resume</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "analytics-section",
      title: "Analytics Dashboard",
      description: "Deep dive into your campaign performance with detailed charts and insights.",
      target: ".analytics-section",
      position: "top",
      content: (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">📈 Analytics Features</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <span className="text-blue-600">📊</span>
              <span className="text-sm">Daily views and donations</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <span className="text-green-600">🎯</span>
              <span className="text-sm">Conversion rates</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
              <span className="text-purple-600">👥</span>
              <span className="text-sm">Donor demographics</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
              <span className="text-orange-600">🔗</span>
              <span className="text-sm">Traffic sources</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      title: "Notification Center",
      description: "Stay informed about all activities related to your campaigns and account.",
      target: ".notifications-section",
      position: "bottom",
      content: (
        <div className="space-y-3">
          <h4 className="font-medium text-slate-900">🔔 Notification Types</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm">New donations</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm">Campaign comments</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-sm">Milestone achievements</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-sm">System updates</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "completion",
      title: "You're All Set! 🎉",
      description: "Congratulations! You now know how to navigate your dashboard effectively.",
      target: "",
      position: "center",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Dashboard Tour Complete!</h3>
          <p className="text-slate-600">
            You&apos;re now ready to create amazing campaigns and make a real impact in Sierra Leone.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <h4 className="font-medium text-indigo-900">🚀 Next Steps</h4>
              <p className="text-xs text-indigo-700">Create your first campaign</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">💡 Need Help?</h4>
              <p className="text-xs text-green-700">Visit our help center</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Pro Tip:</strong> You can replay this tour anytime from the Help menu!
            </p>
          </div>
        </div>
      ),
    },
  ]

  // Auto-start wizard 10 seconds after first dashboard visit
  useEffect(() => {
    if (isFirstTime && !hasStarted) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setHasStarted(true)
      }, 10000) // 10 seconds delay

      return () => clearTimeout(timer)
    }
  }, [isFirstTime, hasStarted])

  // Auto-advance steps when playing
  useEffect(() => {
    if (isVisible && isPlaying && currentStep < wizardSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 8000) // 8 seconds per step

      return () => clearTimeout(timer)
    }
  }, [isVisible, isPlaying, currentStep, wizardSteps.length])

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    onComplete()
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip()
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const currentStepData = wizardSteps[currentStep]

  if (!isVisible) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" />

      {/* Spotlight effect for targeted elements */}
      {currentStepData.target && (
        <style jsx global>{`
          ${currentStepData.target} {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5);
            border-radius: 8px;
          }
        `}</style>
      )}

      {/* Wizard Card */}
      <div
        className={`fixed z-52 transition-all duration-500 ${
          currentStepData.position === "center"
            ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            : currentStepData.position === "top"
              ? "top-4 left-1/2 transform -translate-x-1/2"
              : currentStepData.position === "bottom"
                ? "bottom-4 left-1/2 transform -translate-x-1/2"
                : currentStepData.position === "left"
                  ? "top-1/2 left-4 transform -translate-y-1/2"
                  : "top-1/2 right-4 transform -translate-y-1/2"
        }`}
      >
        <Card className="w-96 max-w-[90vw] shadow-2xl border-2 border-indigo-200">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Step {currentStep + 1} of {wizardSteps.length}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={togglePlayPause} className="h-6 w-6 p-0">
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleRestart} className="h-6 w-6 p-0">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip} className="h-6 w-6 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{currentStepData.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{currentStepData.description}</p>
              <div className="mt-4">{currentStepData.content}</div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-slate-500">
                  Skip Tour
                </Button>
                <Button onClick={handleNext} size="sm" className="flex items-center gap-1">
                  {currentStep === wizardSteps.length - 1 ? "Finish" : "Next"}
                  {currentStep !== wizardSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
