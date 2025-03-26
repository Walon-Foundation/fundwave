"use client"
import type React from "react"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { axiosInstance } from "@/core/api/axiosInstance"
import { useDispatch } from "react-redux"
import { kycUpdate } from "@/core/store/features/user/userSlice"

export default function KycForm() {
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [qualification, setQualification] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  const [phoneNumber, setPhoneNumber] = useState("")

  const dispatch = useDispatch()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = ({
      sex:gender,
      address,
      qualification,
      DOB:dateOfBirth?.toString(),
      phoneNumber,
    })
    try{
        const response = await axiosInstance.patch('/auth/update',data)
        if(response.status === 200){
            dispatch(kycUpdate({userToken:response.data.data.userToken}))
            setAddress("")
            setDateOfBirth(undefined)
            setGender("")
            setPhoneNumber("")
            setQualification("")
        }
    }catch(error){
        console.error(error)
    }
  }

  return (
    <div className="mx-2 flex flex-col items-center justify-center min-h-screen my-10">
        <Card className="max-w-2xl ">
      <CardHeader>
        <CardTitle className="text-2xl">KYC Verification</CardTitle>
        <CardDescription>Please fill out the form below to complete your KYC verification.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={setGender} value={gender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              placeholder="Enter your highest qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dob"
                  variant={"outline"}
                  className={cn("w-full pl-3 text-left font-normal", !dateOfBirth && "text-muted-foreground")}
                >
                  {dateOfBirth ? dateOfBirth.toDateString() : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={setDateOfBirth}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Include country code if applicable</p>
          </div>

          <Button type="submit" className="w-full bg-blue-600">
            Submit KYC Information
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}

