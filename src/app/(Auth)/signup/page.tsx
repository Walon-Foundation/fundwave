"use client"
import Link from "next/link"
import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { axiosInstance } from "@/core/api/axiosInstance"
import { useRouter } from "next/navigation"
import { UserCircle } from "lucide-react"
import useAuthRedirect from "@/core/hooks/useAuthRedirect"

export default function SignUp() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  useAuthRedirect()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const response = await axiosInstance.post("auth/register", formData)
      if (response.status === 201) {
        router.push("/login")
        formRef.current?.reset()
        console.log(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setProfilePreview(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Create Your Account</h1>
          <p className="text-blue-500">Join our community today</p>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription className="text-blue-100">Enter your details to create your account</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Picture Preview */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300 mb-2 flex items-center justify-center bg-blue-50">
                  {profilePreview ? (
                    <Image
                      src={profilePreview || "/placeholder.svg"}
                      alt="Profile Preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-blue-300" />
                  )}
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="profilePicture" className="text-blue-800 block text-center">
                    Profile Picture
                  </Label>
                  <Input
                    id="profilePicture"
                    type="file"
                    name="profilePicture"
                    className="border-blue-200 focus:border-blue-400"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    required
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-blue-700 uppercase tracking-wide">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-800">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      name="firstName"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-800">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      name="lastName"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-blue-800">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="@johndoe"
                      name="username"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-800">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      name="email"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-800">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-800">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    name="confirmPassword"
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-blue-500">Or continue with</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-800">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

