"use client"

import { Calendar, Edit, Mail, MapPin, Phone, } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import { User } from "@/core/types/types"



export default function UserProfile() {
  const token = Cookies.get("userToken") as string
  if(!token || token === ""){
    return <div className="flex flex-col min-h-screen items-center justify-center text-4xl text-red-600"><p>User is not logged in</p></div>
  }
  const decodedUser = jwtDecode(token) as User
  
  if (!decodedUser) return <p className="text-center text-4xl mt-32">Loading User data...</p>

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 flex flex-col  justify-center items-center gap-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">User Profile</h1>

      {/* Container for User Profiles */}
      <div className="w-full max-w-3xl flex flex-col gap-8">
          <Card key={decodedUser._id} className="border-blue-100 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 p-0 h-32 relative">
              <div className="absolute -bottom-16 left-8">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={"hkhk"} alt={`${decodedUser.firstName} ${decodedUser.lastName}`} />
                  <AvatarFallback className="bg-blue-200 text-blue-700 text-2xl">
                    {decodedUser.firstName.charAt(0)}
                    {decodedUser.lastName.charAt(0)}
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
                  <h2 className="text-2xl font-bold text-blue-900">{`${decodedUser.firstName} ${decodedUser.lastName}`}</h2>
                  <p className="text-blue-600">@{decodedUser.username}</p>
                </div>
                <div className="mt-2 md:mt-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {decodedUser.roles}
                </div>
              </div>

              <Separator className="my-6 bg-blue-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-800 mb-3">Contact Information</h3>

                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{decodedUser.email}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{decodedUser.phoneNumber}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{`Sierra Leone`}</span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-800 mb-3">Personal Information</h3>

                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                    <span>Joined: {new Date(decodedUser.createdAt).toLocaleString()}</span>
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
                      <span>{decodedUser.qualification}</span>
                    </div>
                </div>
              </div>
                  <Separator className="my-6 bg-blue-100" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-3">Campaigns</h3>
                    <div className="flex flex-wrap gap-2">
                      {decodedUser?.campaigns?.map((campaign, index) => (
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


