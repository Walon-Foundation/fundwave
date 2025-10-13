"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Bell, Rocket, Heart, Users, CheckCircle, ArrowRight, Sparkles, Calendar } from "lucide-react"

interface ComingSoonProps {
  title?: string
  description?: string
  featureName?: string
  estimatedDate?: string
  features?: string[]
  showNotifyForm?: boolean
}

export default function ComingSoon({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing. This feature is currently under development and will be available soon.",
  featureName = "New Feature",
  estimatedDate = "Q2 2024",
  features = ["Career Page", "Advanced functionality", "Press, Blog and success-story pages", "Real-time updates"],
  showNotifyForm = true,
}: ComingSoonProps) {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-azure-50 via-ocean-50 to-teal-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-8">
          <div className="relative inline-flex">
<div className="w-20 h-20 bg-gradient-to-br from-ocean-600 to-azure-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          <Badge variant="secondary" className="px-4 py-2 bg-blue-100 text-blue-700 border-blue-200 font-medium">
            <Clock className="w-4 h-4 mr-2" />
            Under Development
          </Badge>

          <div className="space-y-6">
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-ocean-600 via-azure-600 to-teal-600 bg-clip-text text-transparent leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">{description}</p>
          </div>

          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium">Expected Launch: {estimatedDate}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
<div className="w-12 h-12 bg-gradient-to-br from-ocean-600 to-azure-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">What&apos;s Coming</h3>
              </div>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
<div className="w-12 h-12 bg-gradient-to-br from-azure-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Why Wait?</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We&apos;re building this feature with your needs in mind. Join our community and be the first to experience
                  the future of crowdfunding in Sierra Leone.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Heart className="w-4 h-4" />
                  <span>Built with ❤️ for Sierra Leone</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showNotifyForm && (
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              {!isSubscribed ? (
                <div className="space-y-6">
                  <div className="space-y-4">
<div className="w-16 h-16 mx-auto bg-gradient-to-br from-ocean-600 to-azure-600 rounded-2xl flex items-center justify-center">
                      <Bell className="w-8 h-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-gray-900">Get Notified</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Be the first to know when {featureName.toLowerCase()} is ready. We&apos;ll send you an email as soon
                        as it&apos;s available.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleNotifyMe} className="max-w-sm mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                        required
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
className="bg-gradient-to-r from-ocean-600 to-azure-600 hover:from-ocean-700 hover:to-azure-700 px-6 whitespace-nowrap"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Notify Me
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-900">You&apos;re All Set!</h3>
                    <p className="text-gray-600">
                      Thanks for your interest! We&apos;ll notify you as soon as {featureName.toLowerCase()} is available.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <p className="text-gray-500">
Questions?{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
