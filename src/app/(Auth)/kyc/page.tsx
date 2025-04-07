"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { axiosInstance } from "@/core/api/axiosInstance"
import { useDispatch } from "react-redux"
import { kycUpdate } from "@/core/store/features/user/userSlice"
import ProfilePicturePreview from "@/components/profile-picture-preview"

import { useRouter } from "next/navigation"

export default function KycForm() {
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [qualification, setQualification] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false) 
  const [error, setError] = useState<string | null>(null)


  const dispatch = useDispatch()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("qualification", qualification);    
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("phoneNumber", phoneNumber);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }  
    try {
      setIsLoading(true)
      const response = await axiosInstance.patch("/auth/update", formData)
      if (response.status === 200) {
        dispatch(kycUpdate({ userToken: response.data.data.userToken }))
        router.push('/profile')
        setAddress("")
        setDateOfBirth("")
        setGender("")
        setPhoneNumber("")
        setQualification("")
      }else {
        setError(response.data.error)
      }
    } catch (error) {
      console.error(error)
      setError("KYC verification failed")
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-2 flex flex-col items-center justify-center min-h-screen my-10">
      <Card className="max-w-2xl w-full">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
          <CardTitle className={`${error ? "text-red-500" : ""}text-2xl`}>{error ? error : "KYC Verification"}</CardTitle>
          <CardDescription className="text-blue-100">
            Please fill out the form below to complete your KYC verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <ProfilePicturePreview onImageChange={setProfilePicture} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-blue-800">
                Gender
              </Label>
              <Select onValueChange={setGender} value={gender}>
                <SelectTrigger id="gender" className="border-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-blue-800">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification" className="text-blue-800">
                Qualification
              </Label>
              <Input
                id="qualification"
                placeholder="Enter your highest qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-blue-800">
                Date of Birth
              </Label>
              <Input
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="MM-DD-YYYY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-blue-800">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+232-00-000-000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? "Loading...." : "Submit KYC"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

