"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Edit, Mail, MapPin, Phone, Award, UserIcon, Megaphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import type { Campaign, User } from "@/core/types/types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { selectAllCampaign } from "@/core/store/features/campaigns/campaignSlice";
import { useAppSelector } from "@/core/hooks/storeHooks";

export default function UserProfile() {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userCampaigns, setUserCampaign] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const allCampaign = useAppSelector(selectAllCampaign);

  const token = Cookies.get("userToken");

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decodedUser = jwtDecode(token) as User;
      setUser(decodedUser);
    } catch (err) {
      console.error(err);
      setError("Invalid token, redirecting...");
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  // This effect runs when `user` changes and filters campaigns based on `user.username`
  useEffect(() => {
    if (user) {
      const filteredCampaign = allCampaign.filter(campaign => campaign.creatorName === user?.username);
      setUserCampaign(filteredCampaign);
    }
  }, [user, allCampaign]);


  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <UserIcon className="h-10 w-10 text-gray-600" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <UserIcon className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">{error || "User not found"}</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile information.</p>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

 
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-800">My Profile</h1>
          <Link href="/dashboard">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="border-blue-100 shadow-xl overflow-hidden">
          {/* Banner and Avatar Section */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 p-0 h-40 relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                {user?.profilePicture ? (
                  <AvatarImage src={user?.profilePicture} alt={`${user?.firstName} ${user?.lastName}`} />
                ) : (
                  <AvatarFallback className="bg-blue-200 text-blue-700 text-2xl">
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <Link href="/profile/edit">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
              >
                <Edit className="w-5 h-5" />
                <span className="sr-only">Edit Profile</span>
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="pt-20 pb-8 px-8">
            {/* User Name and Role */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">{`${user?.firstName} ${user?.lastName}`}</h2>
                <p className="text-blue-600 flex items-center gap-1">
                  @{user?.username}
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                  {user?.roles || "Member"}
                </Badge>
              </div>
            </div>

            <Separator className="my-6 bg-blue-100" />

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-5">
                <h3 className="font-semibold text-blue-800 text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>

                <div className="space-y-4 pl-2">
                  <div className="flex items-center text-gray-700 group hover:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600" />
                    <span>{user?.email}</span>
                  </div>

                  <div className="flex items-center text-gray-700 group hover:text-blue-600 transition-colors">
                    <Phone className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600" />
                    <span>{user?.phoneNumber || "Not provided"}</span>
                  </div>

                  <div className="flex items-center text-gray-700 group hover:text-blue-600 transition-colors">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600" />
                    <span>{user?.address || "Sierra Leone"}</span>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-5">
                <h3 className="font-semibold text-blue-800 text-lg flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Personal Information
                </h3>

                <div className="space-y-4 pl-2">
                  <div className="flex items-center text-gray-700 group hover:text-blue-600 transition-colors">
                    <Calendar className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600" />
                    <span>
                      Joined:{" "}
                      {new Date(user?.createdAt ?? "").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {user?.qualification && (
                    <div className="flex items-start text-gray-700 group hover:text-blue-600 transition-colors">
                      <Award className="w-5 h-5 mr-3 mt-1 text-blue-500 group-hover:text-blue-600" />
                      <span>{user?.qualification}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Campaigns Section */}
            <Separator className="my-6 bg-blue-100" />

            {user?.isCampaign ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-800 text-lg flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  My Campaigns
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user?.campaigns && user?.campaigns.length > 0 ? (
                    (userCampaigns ? (
                      userCampaigns.map((campaign, index) => (
                        <Badge
                          key={index}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                        >
                          {campaign?.campaignName}
                        </Badge>
                      ))
                    ) : (
                      <p>
                        No campaign yet
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No active campaigns</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-semibold text-blue-800 text-lg mb-3">Complete Your KYC to Create Campaigns</h3>
                <p className="text-gray-600 mb-4">
                  To start creating and managing campaigns, you need to complete your KYC verification first.
                </p>
                <Link href="/kyc">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Complete KYC Verification</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
