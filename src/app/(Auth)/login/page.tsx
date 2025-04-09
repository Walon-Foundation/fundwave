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
import useAuthRedirect from "@/core/hooks/useAuthRedirect"
import Image from "next/image"
import { logo } from "@/assets/assets"

export default function SignIn() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const dispatch = useDispatch()

  useAuthRedirect()

  
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      setIsLoading(true)
      const data = {
        username,
        password
      }
      const response = await axiosInstance.post('/auth/login',data)
      console.log(response.data)
      if(response.status === 200 && !response.data.data.isAdmin){
        dispatch(login({
          sessionToken:response.data.data.sessionToken,
          userToken:response.data.data.userToken
        }))
        router.push("/");
      }else {
        setError("Login Failed")
      }
    }catch(error){
      console.error(error)
      setError("Login failed")
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-15 flex items-center justify-center shadow-lg">
            <Image
            src={logo}
            alt="Fundwave logo"
            height={100}
            width={100}
            />
          </div>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
            <CardTitle className={`${error ? "text-red-600" : ""} text-2xl text-center`}>{error ? error : "Welcome back"}</CardTitle>
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

              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? "Signing in..." : "Sign in"}
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

