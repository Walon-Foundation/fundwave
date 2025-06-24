"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, Zap, CheckCircle } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Set cookie for authentication
        document.cookie = "userAuth=true; path=/; max-age=86400" // 24 hours
        localStorage.setItem("authToken", "mock-token")
        router.push("/dashboard")
      } else {
        setError("Please enter valid credentials")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const benefits = [
    { icon: Shield, text: "Secure login" },
    { icon: Zap, text: "Quick access" },
    { icon: CheckCircle, text: "Trusted platform" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-azure-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <ArrowLeft className="w-5 h-5 text-ocean-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-ocean-600 font-medium">Back to Home</span>
            </Link>

            <div className="space-y-4">
              <Badge className="bg-ocean-100 text-ocean-700 hover:bg-ocean-200">👋 Welcome back!</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
                Welcome Back to <span className="gradient-text">FundWaveSL</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Sign in to your account and continue making a difference in Sierra Leone communities.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-700 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-ocean-100">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Platform Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">New campaigns today</span>
                <span className="font-semibold text-ocean-600">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Funds raised this week</span>
                <span className="font-semibold text-ocean-600">Le 2.3M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Active donors</span>
                <span className="font-semibold text-ocean-600">1,247</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center space-x-2 text-ocean-600 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to your FundWaveSL account</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-ocean-600 hover:text-ocean-700">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={isLoading} className="w-full btn-primary py-3 text-lg">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Signup Link */}
                <div className="text-center pt-4 border-t border-slate-200">
                  <p className="text-slate-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-ocean-600 hover:text-ocean-700 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
