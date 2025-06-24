"use client"

import type React from "react"

import { useState } from "react"
import { Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function KYCPage() {
  const [kycStatus, setKycStatus] = useState<"pending" | "approved" | "rejected" | "not-submitted">("not-submitted")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "Sierra Leone",
    idType: "",
    idNumber: "",
    address: "",
    city: "",
    district: "",
    phone: "",
    occupation: "",
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
    selfie: null as File | null,
  })

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mock KYC submission
    console.log("Submitting KYC:", formData)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setKycStatus("pending")
    alert("KYC documents submitted successfully! We will review your documents within 2-3 business days.")
  }

  const getStatusIcon = () => {
    switch (kycStatus) {
      case "approved":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case "pending":
        return <Clock className="w-8 h-8 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="w-8 h-8 text-red-500" />
      default:
        return <AlertCircle className="w-8 h-8 text-slate-400" />
    }
  }

  const getStatusMessage = () => {
    switch (kycStatus) {
      case "approved":
        return {
          title: "KYC Verified",
          message: "Your identity has been successfully verified. You can now create campaigns and withdraw funds.",
          color: "text-green-600",
        }
      case "pending":
        return {
          title: "Under Review",
          message: "Your KYC documents are being reviewed. This usually takes 2-3 business days.",
          color: "text-yellow-600",
        }
      case "rejected":
        return {
          title: "Verification Failed",
          message: "Your KYC documents were rejected. Please check your email for details and resubmit.",
          color: "text-red-600",
        }
      default:
        return {
          title: "Verification Required",
          message: "Complete your KYC verification to unlock all platform features.",
          color: "text-slate-600",
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">KYC Verification</h1>
          <p className="text-xl text-slate-600">Verify your identity to unlock all FundWaveSL features</p>
        </div>

        {/* Status Card */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div>
              <h2 className={`text-xl font-semibold ${statusInfo.color}`}>{statusInfo.title}</h2>
              <p className="text-slate-600">{statusInfo.message}</p>
            </div>
          </div>
        </div>

        {/* KYC Form */}
        {(kycStatus === "not-submitted" || kycStatus === "rejected") && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Personal Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    className="input"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nationality *</label>
                  <select
                    required
                    className="input"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  >
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="input"
                    placeholder="+232 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Occupation *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Address Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Street Address *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">District *</label>
                  <select
                    required
                    className="input"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  >
                    <option value="">Select District</option>
                    <option value="Western Area">Western Area</option>
                    <option value="Bo">Bo</option>
                    <option value="Kenema">Kenema</option>
                    <option value="Makeni">Makeni</option>
                    <option value="Koidu">Koidu</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Identity Documents */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Identity Documents</h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ID Type *</label>
                    <select
                      required
                      className="input"
                      value={formData.idType}
                      onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                    >
                      <option value="">Select ID Type</option>
                      <option value="national-id">National ID Card</option>
                      <option value="passport">Passport</option>
                      <option value="drivers-license">Driver's License</option>
                      <option value="voters-card">Voter's Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ID Number *</label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Document Uploads */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ID Document (Front & Back) *
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)}
                        className="hidden"
                        id="id-upload"
                        required
                      />
                      <label
                        htmlFor="id-upload"
                        className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500"
                      >
                        {formData.idDocument ? formData.idDocument.name : "Upload ID"}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Proof of Address *</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("proofOfAddress", e.target.files?.[0] || null)}
                        className="hidden"
                        id="address-upload"
                        required
                      />
                      <label
                        htmlFor="address-upload"
                        className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500"
                      >
                        {formData.proofOfAddress ? formData.proofOfAddress.name : "Upload Document"}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Selfie with ID *</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("selfie", e.target.files?.[0] || null)}
                        className="hidden"
                        id="selfie-upload"
                        required
                      />
                      <label
                        htmlFor="selfie-upload"
                        className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-500"
                      >
                        {formData.selfie ? formData.selfie.name : "Upload Selfie"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button type="submit" className="btn-primary px-8 py-3">
                Submit for Verification
              </button>
            </div>
          </form>
        )}

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
