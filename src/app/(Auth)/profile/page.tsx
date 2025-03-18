" use client"

import { Calendar, Edit, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { aprof } from "@/assets/assets";

export default function UserProfile() {
  const user = [{
    null:null
  }]

  if (!user) return <p className="text-center text-4xl mt-32">Loading user data...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4 flex flex-col items-center gap-4 justify-center">
      {/* Container for User Profiles */}
      <div className="flex flex-col">
        {user.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6"
          >
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-6 justify-between">
              <Image
                src={aprof}
                alt="profile"
                className="w-48 h-48 rounded-full object-cover border border-gray-200 shadow-md"
              />
              <div className="flex flex-col gap-6 items-center text-gray-800">
                <h2 className="text-3xl font-bold">Fullname: <span>{`${user.firstName} ${user.lastName}`}</span></h2>
                <p className="text-lg mt-2">Email: @{user.email?.split("@")[0]}</p>
                <p className="text-lg mt-2 ">UserId: {user._id}</p>
              </div>
              <button className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
                <Edit className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <Mail className="w-6 h-6 mr-4 text-blue-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-6 h-6 mr-4 text-green-500" />
                <span>{user.phoneNumber}</span>
              </div>
            </div>

            {/* Location and Join Date */}
            <div className="flex flex-col items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-4 text-red-500" />
                <span>{`${user.capitalCity}, ${user.country}`}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-4 text-purple-500" />
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}