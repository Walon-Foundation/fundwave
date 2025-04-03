"use client";
import Link from "next/link";
import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { axiosInstance } from "@/core/api/axiosInstance";
import { useRouter } from "next/navigation";
import useAuthRedirect from "@/core/hooks/useAuthRedirect";
import ProfilePicturePreview from "@/components/profile-picture-preview";

export default function SignUp() {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState<File | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useAuthRedirect();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("username", username);
      if (profilePreview) {
        formData.append("profilePicture", profilePreview);
      }
      if (password != confirmPassword) {
        return;
      }
      const response = await axiosInstance.post("auth/register", formData);
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-blue-500">Join our community today</p>
        </div>

        <Card className="border-blue-100 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription className="text-blue-100">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Picture Preview */}
              <div className="flex flex-col items-center mb-4">
                <ProfilePicturePreview onImageChange={setProfilePreview} />
              </div>

              {/* Personal Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-blue-700 uppercase tracking-wide">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-800">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      name="firstName"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-800">
                      Last Name
                    </Label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      id="lastName"
                      placeholder="Doe"
                      name="lastName"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-blue-800">
                      Username
                    </Label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      id="username"
                      placeholder="@johndoe"
                      name="username"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-blue-800">
                      Email
                    </Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      name="email"
                      className="border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-800">
                    Password
                  </Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-800">
                    Confirm Password
                  </Label>
                  <Input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    name="confirmPassword"
                    className="border-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-blue-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-blue-800">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
