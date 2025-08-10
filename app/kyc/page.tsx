"use client"

import { useState } from "react"
import { Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { axiosInstance } from "../../lib/axiosInstance"
import { useRouter } from "next/navigation"
import { PhoneNumber } from "@clerk/nextjs/server"

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
    phoneNumber:""
  })

  const router = useRouter()

  const [previewImages, setPreviewImages] = useState({
    documentPhoto: "",
    profilePicture: "",
  })

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    setFormData(prev => ({ ...prev, [field]: file }))
    
    // Create preview
    setPreviewImages(prev => ({
      ...prev,
      [field]: URL.createObjectURL(file)
    }))
  }

  const removeFile = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: null }))
    setPreviewImages(prev => ({ ...prev, [field]: "" }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

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
    
    if (formData.profilePicture) {
      submitData.append("profilePicture", formData.profilePicture)
    }
    
    if (formData.documentPhoto) {
      submitData.append("documentPhoto", formData.documentPhoto)
    }
    
    try {
      const res = await axiosInstance.patch("/user/kyc", submitData)
      if(res.status === 200){
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
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">KYC Verification</h1>
          <p className="text-xl text-slate-600">Verify your identity to unlock all FundWaveSL features</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step === stepNumber
                      ? "bg-indigo-600 text-white"
                      : step > stepNumber
                      ? "bg-green-100 text-green-600"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {stepNumber}
                </div>
                <span className="text-sm mt-2 text-slate-600">
                  {stepNumber === 1 ? "Personal" : stepNumber === 2 ? "Documents" : "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full">
            <div
              className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="card space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Personal Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture *</label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {previewImages.profilePicture ? (
                      <>
                        <img
                          src={previewImages.profilePicture}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("profilePicture")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
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
                      <div className="border-2 border-dashed border-slate-300 rounded-full w-20 h-20 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div>
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
                      className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500"
                    >
                      {formData.profilePicture ? "Change Photo" : "Upload Photo"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="18"
                    max="120"
                    className="input"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nationality *</label>
                  <select
                    name="nationality"
                    required
                    className="input"
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
                    className="input"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>
                  <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">PhoneNumber *</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    required
                    className="input"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="input"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">District *</label>
                  <select
                    name="district"
                    required
                    className="input"
                    value={formData.district}
                    onChange={handleChange}
                  >
                    <option value="">Select District</option>
                    <option value="Western Area Rural">Western Area Rural</option>
                    <option value="Bo">Bo</option>
                    <option value="Kenema">Kenema</option>
                    <option value="Kono">Kono</option>
                    <option value="Kailahun">Kailahun</option>
                    <option value="Falaba">Falaba</option>
                    <option value="Tonkolili">Tonkolili</option>
                    <option value="Western Area Urban">Western Area Urban</option>
                    <option value="Bombali">Bombali</option>
                    <option value="Koinadugu">Koinadugu</option>
                    <option value="Port Loko">Port Loko</option>
                    <option value="Kambia">Kambia</option>
                    <option value="Bonthe">Bonthe</option>
                    <option value="Moyamba">Moyamba</option>
                    <option value="Punjehun">Punjehun</option>
                    <option value="Karene">Karene</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary px-8 py-3 flex items-center"
                  disabled={!formData.age || !formData.address || !formData.district || !formData.occupation || !formData.profilePicture}
                >
                  Next <ChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {step === 2 && (
            <div className="card space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Identity Documents</h2>

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Document Type *</label>
                    <select
                      name="documentType"
                      required
                      className="input"
                      value={formData.documentType}
                      onChange={handleChange}
                    >
                      <option value="">Select Document Type</option>
                      <option value="national-id">National ID Card</option>
                      <option value="passport">Passport</option>
                      <option value="drivers-license">Driver's License</option>
                      <option value="voters-card">Voter's Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Document Number *</label>
                    <input
                      type="text"
                      name="documentNumber"
                      required
                      className="input"
                      value={formData.documentNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Document Photo *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                    {previewImages.documentPhoto ? (
                      <div className="relative">
                        <img
                          src={previewImages.documentPhoto}
                          alt="Document preview"
                          className="w-full h-48 object-contain rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("documentPhoto")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
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
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
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
                          className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500"
                        >
                          Upload Document Photo
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-outline px-8 py-3 flex items-center"
                >
                  <ChevronLeft className="mr-2" /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary px-8 py-3 flex items-center"
                  disabled={!formData.documentType || !formData.documentNumber || !formData.documentPhoto}
                >
                  Next <ChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review and Submit */}
          {step === 3 && (
            <div className="card space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900">Review Your Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-700 mb-4">Personal Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Age:</span> {formData.age}
                    </p>
                    <p>
                      <span className="font-medium">Nationality:</span> {formData.nationality}
                    </p>
                    <p>
                      <span className="font-medium">Occupation:</span> {formData.occupation}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {formData.address}
                    </p>
                    <p>
                      <span className="font-medium">District:</span> {formData.district}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-slate-700 mb-4">Document Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Document Type:</span> {formData.documentType}
                    </p>
                    <p>
                      <span className="font-medium">Document Number:</span> {formData.documentNumber}
                    </p>
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="relative">
                        {previewImages.profilePicture && (
                          <img
                            src={previewImages.profilePicture}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div className="relative">
                        {previewImages.documentPhoto && (
                          <img
                            src={previewImages.documentPhoto}
                            alt="Document preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-outline px-8 py-3 flex items-center"
                  disabled={isLoading}
                >
                  <ChevronLeft className="mr-2" /> Back
                </button>
                <button
                  type="submit"
                  className="btn-primary px-8 py-3 flex items-center justify-center min-w-32"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : "Submit Verification"}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Additional Information */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Why do we need KYC verification?</h3>
          <ul className="space-y-2 text-slate-600">
            <li>• Comply with Sierra Leone financial regulations</li>
            <li>• Prevent fraud and protect all users</li>
            <li>• Enable secure fund withdrawals</li>
            <li>• Build trust in the FundWaveSL community</li>
          </ul>
        </div>
      </div>
    </div>
  )
}