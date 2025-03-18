"use client"

import { Calendar, Edit, Mail, MapPin, Phone, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  username: string
  country: string
  capitalCity: string
  phoneNumber: string
  sex: string
  DOB: string
  qualification?: string
  campaigns?: string[]
  isCampaign: boolean
  roles: string
  createdAt: string
  profileImage?: string
}

export default function UserProfile() {
  // Mock data based on the provided interface
  const user = 
    {
      _id: "usr_12345abcde",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      country: "United States",
      capitalCity: "Washington D.C.",
      phoneNumber: "+1 (555) 123-4567",
      sex: "Male",
      DOB: "1990-05-15",
      qualification: "Master's in Computer Science",
      campaigns: ["campaign1", "campaign2"],
      isCampaign: true,
      roles: "Developer",
      createdAt: "2022-03-10T08:15:30Z",
      profileImage: "/placeholder.svg?height=200&width=200",
    }

  if (!user) return <p className="text-center text-4xl mt-32">Loading user data...</p>

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 flex flex-col  justify-center items-center gap-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">User Profiles</h1>

      {/* Container for User Profiles */}
      <div className="w-full max-w-3xl flex flex-col gap-8">
          <Card key={user._id} className="border-blue-100 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 p-0 h-32 relative">
              <div className="absolute -bottom-16 left-8">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="bg-blue-200 text-blue-700 text-2xl">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
              >
                <Edit className="w-5 h-5" />
                <span className="sr-only">Edit Profile</span>
              </Button>
            </CardHeader>

            <CardContent className="pt-20 pb-6 px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">{`${user.firstName} ${user.lastName}`}</h2>
                  <p className="text-blue-600">@{user.username}</p>
                </div>
                <div className="mt-2 md:mt-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {user.roles}
                </div>
              </div>

              <Separator className="my-6 bg-blue-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-800 mb-3">Contact Information</h3>

                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{user.phoneNumber}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{`${user.capitalCity}, ${user.country}`}</span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-800 mb-3">Personal Information</h3>

                  <div className="flex items-center text-gray-700">
                    <UserIcon className="w-5 h-5 mr-3 text-blue-500" />
                    <span>ID: {user._id}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                    <div className="flex items-start text-gray-700">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 mr-3 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <span>{user.qualification}</span>
                    </div>
                </div>
              </div>
                  <Separator className="my-6 bg-blue-100" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-3">Campaigns</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.campaigns.map((campaign, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {campaign}
                        </span>
                      ))}
                    </div>
                  </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}


