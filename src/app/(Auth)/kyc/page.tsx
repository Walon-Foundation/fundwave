"use client"
import type React from "react"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format, subYears } from "date-fns"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KycForm() {
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [qualification, setQualification] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
  const [phoneNumber, setPhoneNumber] = useState("")

  // For the dropdown date selection
  const [birthYear, setBirthYear] = useState<string>("")
  const [birthMonth, setBirthMonth] = useState<string>("")
  const [birthDay, setBirthDay] = useState<string>("")

  const dispatch = useDispatch()

  // Calculate min and max dates for the calendar
  const maxDate = subYears(new Date(), 18) // Must be at least 18 years old
  const minDate = subYears(new Date(), 100) // Assuming no one is older than 100

  // Generate years for dropdown (100 years back from current year - 18)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 83 }, (_, i) => (currentYear - 18 - i).toString())

  // Generate months
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  // Generate days based on selected year and month
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => (i + 1).toString())

    const daysInMonth = new Date(Number.parseInt(year), Number.parseInt(month) + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
  }

  const days = getDaysInMonth(birthYear, birthMonth)

  // Handle dropdown date change
  const handleDropdownDateChange = () => {
    if (birthYear && birthMonth && birthDay) {
      const newDate = new Date(Number.parseInt(birthYear), Number.parseInt(birthMonth), Number.parseInt(birthDay))
      setDateOfBirth(newDate)
    }
  }

  // Update dropdowns when calendar date changes
  const handleCalendarDateChange = (date: Date | undefined) => {
    setDateOfBirth(date)
    if (date) {
      setBirthYear(date.getFullYear().toString())
      setBirthMonth(date.getMonth().toString())
      setBirthDay(date.getDate().toString())
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      sex: gender,
      address,
      qualification,
      DOB: dateOfBirth?.toString(),
      phoneNumber,
    }
    try {
      const response = await axiosInstance.patch("/auth/update", data)
      if (response.status === 200) {
        dispatch(kycUpdate({ userToken: response.data.data.userToken }))
        setAddress("")
        setDateOfBirth(undefined)
        setBirthYear("")
        setBirthMonth("")
        setBirthDay("")
        setGender("")
        setPhoneNumber("")
        setQualification("")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="mx-2 flex flex-col items-center justify-center min-h-screen my-10">
      <Card className="max-w-2xl w-full">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl">KYC Verification</CardTitle>
          <CardDescription className="text-blue-100">
            Please fill out the form below to complete your KYC verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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

              <Tabs defaultValue="dropdown" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="dropdown">Dropdown Selection</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                </TabsList>

                <TabsContent value="dropdown" className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="year" className="text-sm text-blue-700">
                        Year
                      </Label>
                      <Select
                        value={birthYear}
                        onValueChange={(value) => {
                          setBirthYear(value)
                          handleDropdownDateChange()
                        }}
                      >
                        <SelectTrigger id="year" className="border-blue-200">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="month" className="text-sm text-blue-700">
                        Month
                      </Label>
                      <Select
                        value={birthMonth}
                        onValueChange={(value) => {
                          setBirthMonth(value)
                          handleDropdownDateChange()
                        }}
                      >
                        <SelectTrigger id="month" className="border-blue-200">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="day" className="text-sm text-blue-700">
                        Day
                      </Label>
                      <Select
                        value={birthDay}
                        onValueChange={(value) => {
                          setBirthDay(value)
                          handleDropdownDateChange()
                        }}
                      >
                        <SelectTrigger id="day" className="border-blue-200">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {dateOfBirth && (
                    <div className="text-sm text-blue-600 font-medium">Selected: {format(dateOfBirth, "PPP")}</div>
                  )}
                </TabsContent>

                <TabsContent value="calendar">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dob"
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-blue-200",
                          !dateOfBirth && "text-muted-foreground",
                        )}
                      >
                        {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={handleCalendarDateChange}
                        disabled={(date) => date > maxDate || date < minDate}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={currentYear - 100}
                        toYear={currentYear - 18}
                      />
                    </PopoverContent>
                  </Popover>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-blue-800">
                Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
              <p className="text-sm text-muted-foreground">Include country code if applicable</p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Submit KYC Information
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

