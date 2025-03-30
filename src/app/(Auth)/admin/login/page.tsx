"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Shield, AlertCircle, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { axiosInstance } from "@/core/api/axiosInstance"
import { useDispatch } from "react-redux"
import { login } from "@/core/store/features/user/userSlice"

export default function AdminLogin() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try{
      const data = {
        username,
        password
      }
      const response = await axiosInstance.post("/auth/login",data)
      if(response.status === 200){
        console.log(response.data)
        dispatch(login({
          sessionToken:response.data.data.sessionToken,
          userToken:response.data.data.userToken
        }))
      }
    }catch(error){
      setIsLoading(false)
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Admin Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
            <Shield className="h-8 w-8" />
          </div>
        </div>

        <Card className="border-blue-100 shadow-xl">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            </div>
            <CardDescription className="text-blue-100">Secure access for administrative users</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-6">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription>This area is restricted to authorized personnel only.</AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-800 font-medium">
                  Admin Email
                </Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="admin@company.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-blue-200 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-blue-800 font-medium">
                    Password
                  </Label>
                  <Link
                    href="/admin/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-800"
                >
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In to Admin Panel"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 bg-blue-50 rounded-b-lg border-t border-blue-100">
            <div className="text-center w-full">
              <p className="text-sm text-blue-800">
                Need an admin account?{" "}
                <Link href="/admin/register" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                  Request Access
                </Link>
              </p>
            </div>

            <div className="text-center w-full">
              <Link href="/" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                Return to main site
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

