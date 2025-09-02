"use client"

import type React from "react"

import { useState } from "react"
import { Upload, ChevronLeft, ChevronRight, User, FileText, CheckCircle2, Shield, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api/api"
import Image from "next/image"

export default function KYCPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    district: "",
    documentType: "",
    documentNumber: "",
    documentPhoto: null as File | null,
    occupation: "",
    nationality: "Sierra Leonean",
    profilePicture: null as File | null,
    age: "",
    phoneNumber: "",
    bio: "",
  })

  const router = useRouter()

  const [previewImages, setPreviewImages] = useState({
    documentPhoto: "",
    profilePicture: "",
  })

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    setFormData((prev) => ({ ...prev, [field]: file }))

    // Create preview
    setPreviewImages((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }))
  }

  const removeFile = (field: string) => {
    setFormData((prev) => ({ ...prev, [field]: null }))
    setPreviewImages((prev) => ({ ...prev, [field]: "" }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.documentPhoto || !formData.profilePicture) {
      alert("Please upload both document photo and profile picture")
      return
    }

    setIsLoading(true)

    // Create FormData object for backend submission
    const submitData = new FormData()

    submitData.append("address", formData.address)
    submitData.append("district", formData.district)
    submitData.append("documentType", formData.documentType)
    submitData.append("documentNumber", formData.documentNumber)
    submitData.append("occupation", formData.occupation)
    submitData.append("nationality", formData.nationality)
    submitData.append("age", formData.age)
    submitData.append("phoneNumber", formData.phoneNumber)
    submitData.append("bio", formData.bio)

    if (formData.profilePicture) {
      submitData.append("profilePicture", formData.profilePicture)
    }

    if (formData.documentPhoto) {
      submitData.append("documentPhoto", formData.documentPhoto)
    }

    try {
      const res = await api.createKYC(submitData)
      if (res.status === 200) {
        router.push("/dashboard")
        alert("KYC completed successfully")
      }
    } catch (error) {
      console.log(error)
      alert("An error occurred while submitting KYC. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">KYC Verification</h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Verify your identity to unlock all FundWaveSL features and start fundraising
          </p>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-6">
            {[
              { number: 1, label: "Personal", icon: User },
              { number: 2, label: "Documents", icon: FileText },
              { number: 3, label: "Review", icon: CheckCircle2 },
            ].map(({ number, label, icon: Icon }) => (
              <div key={number} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step === number
                      ? "bg-indigo-600 text-white shadow-lg scale-110"
                      : step > number
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm mt-2 text-slate-600 font-medium">{label}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Personal Information</h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 bg-slate-50 rounded-xl">
                <div className="flex justify-center sm:justify-start">
                  <div className="relative">
                    {previewImages.profilePicture ? (
                      <>
                        <Image
                          src={previewImages.profilePicture}
                          alt="Profile preview"
                          width={500}
                          height={400}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("profilePicture")}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div className="border-2 border-dashed border-slate-300 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-white">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload("profilePicture", e.target.files)}
                    className="hidden"
                    id="profile-upload"
                    required
                  />
                  <label
                    htmlFor="profile-upload"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {formData.profilePicture ? "Change Photo" : "Upload Photo"}
                  </label>
                  <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF (max 50MB)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself, your background, and what motivates you to fundraise..."
                  maxLength={500}
                />
                <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="18"
                    max="120"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nationality *</label>
                  <select
                    name="nationality"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.nationality}
                    onChange={handleChange}
                  >
                    <option value="Sierra Leonean">Sierra Leonean</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Occupation *</label>
                  <input
                    type="text"
                    name="occupation"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Your occupation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+232 XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">District *</label>
                  <select
                    name="district"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={formData.district}
                    onChange={handleChange}
                  >
                    <option value="">Select District</option>
                    <option value="Bo">Bo</option>
                    <option value="Bombali">Bombali</option>
                    <option value="Bonthe">Bonthe</option>
                    <option value="Falaba">Falaba</option>
                    <option value="Kailahun">Kailahun</option>
                    <option value="Kambia">Kambia</option>
                    <option value="Karene">Karene</option>
                    <option value="Kenema">Kenema</option>
                    <option value="Koinadugu">Koinadugu</option>
                    <option value="Kono">Kono</option>
                    <option value="Moyamba">Moyamba</option>
                    <option value="Port Loko">Port Loko</option>
                    <option value="Punjehun">Punjehun</option>
                    <option value="Tonkolili">Tonkolili</option>
                    <option value="Western Area Rural">Western Area Rural</option>
                    <option value="Western Area Urban">Western Area Urban</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !formData.age ||
                    !formData.address ||
                    !formData.district ||
                    !formData.occupation ||
                    !formData.profilePicture
                  }
                >
                  Next Step <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Identity Documents</h2>
              </div>

              <div className="grid gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Document Type *</label>
                    <select
                      name="documentType"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={formData.documentType}
                      onChange={handleChange}
                    >
                      <option value="">Select Document Type</option>
                      <option value="national-id">National ID Card</option>
                      <option value="passport">Passport</option>
                      <option value="drivers-license">Driver&apos;s License</option>
                      <option value="voters-card">Voter&apos;s Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Document Number *</label>
                    <input
                      type="text"
                      name="documentNumber"
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      value={formData.documentNumber}
                      onChange={handleChange}
                      placeholder="Enter document number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Document Photo *</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 sm:p-8 bg-slate-50 hover:bg-slate-100 transition-colors">
                    {previewImages.documentPhoto ? (
                      <div className="relative">
                        <Image
                          src={previewImages.documentPhoto}
                          alt="Document preview"
                          width={500}
                          height={400}
                          className="w-full max-w-md mx-auto h-48 sm:h-64 object-contain rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("documentPhoto")}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("documentPhoto", e.target.files)}
                          className="hidden"
                          id="document-upload"
                          required
                        />
                        <label
                          htmlFor="document-upload"
                          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Document Photo
                        </label>
                        <p className="text-sm text-slate-500 mt-3">
                          Clear photo of your ID document (JPG, PNG - max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 sm:px-8 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!formData.documentType || !formData.documentNumber || !formData.documentPhoto}
                >
                  Review Details <ChevronRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review and Submit */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">Review Your Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Age", value: formData.age },
                      { label: "Nationality", value: formData.nationality },
                      { label: "Occupation", value: formData.occupation },
                      { label: "Phone Number", value: formData.phoneNumber },
                      { label: "Address", value: formData.address },
                      { label: "District", value: formData.district },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-2 border-b border-slate-100">
                        <span className="font-medium text-slate-600">{label}:</span>
                        <span className="text-slate-900">{value}</span>
                      </div>
                    ))}
                    {formData.bio && (
                      <div className="py-2 border-b border-slate-100">
                        <span className="font-medium text-slate-600">Bio:</span>
                        <p className="text-slate-900 mt-1 text-sm leading-relaxed">{formData.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Document Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-medium text-slate-600">Document Type:</span>
                      <span className="text-slate-900 capitalize">{formData.documentType?.replace("-", " ")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="font-medium text-slate-600">Document Number:</span>
                      <span className="text-slate-900">{formData.documentNumber}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-slate-700 mb-3">Uploaded Images</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {previewImages.profilePicture && (
                        <div className="text-center">
                          <Image
                            src={previewImages.profilePicture}
                            height={300}
                            width={200}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-slate-200"
                          />
                          <p className="text-xs text-slate-500 mt-1">Profile Photo</p>
                        </div>
                      )}
                      {previewImages.documentPhoto && (
                        <div className="text-center">
                          <Image
                            height={300}
                            width={200}
                            src={previewImages.documentPhoto || "/placeholder.svg"}
                            alt="Document preview"
                            className="w-20 h-20 object-cover rounded mx-auto border-2 border-slate-200"
                          />
                          <p className="text-xs text-slate-500 mt-1">Document Photo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 sm:px-8 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg flex items-center justify-center transition-colors"
                  disabled={isLoading}
                >
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg flex items-center justify-center min-w-40 transition-all shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 w-4 h-4" />
                      Submit Verification
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 mt-8 border border-blue-100">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Why do we need KYC verification?</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Comply with Sierra Leone financial regulations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Prevent fraud and protect all users</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Enable secure fund withdrawals</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Build trust in the FundWaveSL community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
