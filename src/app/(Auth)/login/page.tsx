"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ToastContainer } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { axiosInstance } from "@/core/api/axiosInstance"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { login } from "@/core/store/features/user/userSlice"

export default function SignIn() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()
  const dispatch = useDispatch()

  
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      const data = {
        username,
        password
      }
      const response = await axiosInstance.post('/auth/login',data)
      console.log(response.data)
      if(response.status === 200){
        dispatch(login({
          sessionToken:response.data.data.sessionToken,
          userToken:response.data.data.userToken
        }))
        router.push("/");
      }
    }catch(error){
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-blue-100 text-center">Sign in to your account</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-800">
                  Username
                </Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="@johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-blue-800">
                    Password
                  </Label>
                  <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <Separator className="w-full "/>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
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
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  )
}

