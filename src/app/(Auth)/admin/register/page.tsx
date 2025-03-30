"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Shield, Info, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { axiosInstance } from "@/core/api/axiosInstance"
import { useRouter } from "next/navigation"
import ProfilePicturePreview from "@/components/profile-picture-preview"

export default function AdminRegister() {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState<string>("")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("firstName", firstName)
      formData.append("lastName", lastName)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("role", role)
      formData.append("username",username)
      if (profilePicture) {
        formData.append("profilePicture", profilePicture)
      }

      if (password === confirmPassword) {
        const response = await axiosInstance.post("/auth/register", formData)
        if (response.status === 201) {
          setIsLoading(false)
          router.push("/admin/login")
        } else {
          setError("Admin registration failed")
        }
      } else {
        setError("Password and Confirm Password do not match")
      }
    } catch (error) {
      setError("Admin registration failed")
      console.error(error)
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "" }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    const labels = ["Weak", "Fair", "Good", "Strong"]
    return { strength, label: labels[strength - 1] || "" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
              <CardTitle className="text-2xl font-bold">{error ? error : "Admin Registration"}</CardTitle>
            </div>
            <CardDescription className="text-blue-100">Request administrative access to the system</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-6">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                All admin registration requests require approval from a system administrator.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex justify-center">
                    <ProfilePicturePreview onImageChange={setProfilePicture} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-800">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-blue-200 focus-visible:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-800">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-blue-200 focus-visible:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-blue-800">
                      Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="@johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-blue-200 focus-visible:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-800">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-blue-600">Must be a company email address</p>
                </div>
              </div>

              <Separator className="bg-blue-100" />

              {/* Role Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800">Access Level</h3>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-blue-800">
                    Role
                  </Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-blue-100" />

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800">Security</h3>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-blue-800">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-500"
                    required
                  />

                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-blue-800">Password strength:</span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.strength === 4
                              ? "text-green-600"
                              : passwordStrength.strength >= 2
                                ? "text-amber-600"
                                : "text-red-600"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            passwordStrength.strength === 4
                              ? "bg-green-500"
                              : passwordStrength.strength === 3
                                ? "bg-amber-500"
                                : passwordStrength.strength === 2
                                  ? "bg-amber-600"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <li className="flex items-center">
                          <Check
                            className={`h-3 w-3 mr-1 ${password.length >= 8 ? "text-green-500" : "text-gray-400"}`}
                          />
                          <span className={password.length >= 8 ? "text-blue-800" : "text-gray-500"}>
                            At least 8 characters
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Check
                            className={`h-3 w-3 mr-1 ${/[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"}`}
                          />
                          <span className={/[A-Z]/.test(password) ? "text-blue-800" : "text-gray-500"}>
                            Uppercase letter
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Check
                            className={`h-3 w-3 mr-1 ${/[0-9]/.test(password) ? "text-green-500" : "text-gray-400"}`}
                          />
                          <span className={/[0-9]/.test(password) ? "text-blue-800" : "text-gray-500"}>Number</span>
                        </li>
                        <li className="flex items-center">
                          <Check
                            className={`h-3 w-3 mr-1 ${/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-gray-400"}`}
                          />
                          <span className={/[^A-Za-z0-9]/.test(password) ? "text-blue-800" : "text-gray-500"}>
                            Special character
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-blue-800">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`border-blue-200 focus-visible:ring-blue-500 ${
                      confirmPassword && password !== confirmPassword ? "border-red-300" : ""
                    }`}
                    required
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-800"
                  >
                    I accept the terms and conditions
                  </label>
                  <p className="text-xs text-blue-600">
                    By requesting admin access, you agree to follow all security protocols and acceptable use policies.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={ !acceptTerms || ((confirmPassword && password !== confirmPassword) as boolean)}
              >
                {isLoading ? "Submitting Request..." : "Submit Admin Access Request"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center bg-blue-50 rounded-b-lg border-t border-blue-100">
            <div className="text-center">
              <p className="text-sm text-blue-800">
                Already have an admin account?{" "}
                <Link href="/admin/login" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

