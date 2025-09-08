"use client"

import type React from "react"
import { useState } from "react"
import { X, Smartphone, Lock, Copy, CheckCircle, ArrowLeft, ArrowRight, AlertCircle, Heart } from "lucide-react"
import { api } from "@/lib/api/api"

interface DonationModalProps {
  campaign: {
    id: string
    title: string
    organizer: string
  }
  onClose: () => void
}

const donationAmounts = [25, 50, 100, 250, 500, 1000]

export default function DonationModal({ campaign, onClose }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("orange-money")
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    anonymous: false,
  })
  const [step, setStep] = useState(1)
  const [ussdCode, setUssdCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "NLe",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const validateAmount = () => {
    const amount = selectedAmount || Number.parseInt(customAmount)
    if (!amount || amount < 1) {
      setError("Minimum donation amount is NLe 1")
      return false
    }
    if (amount > 50000) {
      setError("Maximum donation amount is NLe 50,000")
      return false
    }
    setError("")
    return true
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(076|077|078|030|031|032|033|034|025|088|075)\d{6}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const handleNext = () => {
    if (!validateAmount()) return
    setStep(step + 1)
  }

  const handlePaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validatePhone(donorInfo.phone)) {
      setError("Please enter a valid Sierra Leone phone number")
      return
    }

    setIsLoading(true)

    try {
      const data = await api.createPayment(
        {
          name: donorInfo.name || undefined,
          amount: selectedAmount || Number.parseInt(customAmount),
          phone: donorInfo.phone,
          email: donorInfo.email,
          isAnonymous: donorInfo.anonymous,
        },
        campaign.id,
      )

      setUssdCode(data)
      setStep(4)
    } catch (error) {
      console.error("Error generating USSD code:", error)
      setError("Failed to generate payment code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDonate = () => {
    setStep(5)
  }

  const copyUSSDCode = async () => {
    try {
      await navigator.clipboard.writeText(ussdCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.log(err)
      const textArea = document.createElement("textarea")
      textArea.value = ussdCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const stepTitles = ["", "Select Amount", "Payment Method", "Your Details", "Complete Payment", "Thank You!"]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Make a Donation</h2>
                <p className="text-xs sm:text-sm text-slate-600">{stepTitles[step]}</p>
              </div>
            </div>
            <button
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 sm:p-2 rounded-lg transition-colors"
              onClick={() => onClose()}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Enhanced Progress Indicator */}
          <div className="flex items-center mb-6 sm:mb-8">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    step >= stepNumber
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-110"
                      : step === stepNumber - 1
                        ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-200"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`h-1 w-4 sm:w-8 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                      step > stepNumber ? "bg-gradient-to-r from-indigo-500 to-purple-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Campaign Info */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">{campaign.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600">by {campaign.organizer}</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Amount Selection */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Select Donation Amount</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount)
                        setCustomAmount("")
                        setError("")
                      }}
                      className={`p-3 sm:p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 hover:scale-105 text-sm sm:text-base ${
                        selectedAmount === amount
                          ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-lg"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Or enter custom amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Enter amount in NLe"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        setSelectedAmount(null)
                        setError("")
                      }}
                      min="1"
                      max="50000"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-slate-400 text-sm">NLe</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Minimum: NLe 1 • Maximum: NLe 50,000</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Choose Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-all duration-200 hover:border-orange-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="orange-money"
                    checked={paymentMethod === "orange-money"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 sm:mr-4 w-4 h-4 text-orange-500"
                  />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">Orange Money</span>
                    <p className="text-xs sm:text-sm text-slate-600">Pay with your Orange Money wallet</p>
                  </div>
                </label>

                <label className="flex items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-all duration-200 hover:border-blue-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="africell-money"
                    checked={paymentMethod === "africell-money"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 sm:mr-4 w-4 h-4 text-blue-500"
                  />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">Africell Money</span>
                    <p className="text-xs sm:text-sm text-slate-600">Pay with your Africell Money wallet</p>
                  </div>
                </label>

                <div className="flex items-center p-3 sm:p-4 border-2 border-slate-100 rounded-xl opacity-60 bg-slate-50">
                  <input type="radio" disabled className="mr-3 sm:mr-4 w-4 h-4" />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-400 text-sm sm:text-base">Credit/Debit Card</span>
                      <span className="bg-slate-200 text-slate-500 text-xs px-2 py-1 rounded-full">Coming Soon</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">International payments</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-slate-200 text-slate-700 py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Details */}
          {step === 3 && (
            <form onSubmit={handlePaymentDetails} className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Payment Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="076 XXX XXXX"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your {paymentMethod === "orange-money" ? "Orange" : "Africell"} number
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
                <div className="flex items-center mb-3 sm:mb-4">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={donorInfo.anonymous}
                    onChange={(e) => setDonorInfo({ ...donorInfo, anonymous: e.target.checked })}
                    className="mr-3 w-4 h-4 text-indigo-600 rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm font-medium text-slate-700">
                    Make this donation anonymous
                  </label>
                </div>

                {!donorInfo.anonymous && (
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name (optional)"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Summary */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 sm:p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 text-sm sm:text-base">Donation Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm sm:text-base">Donation Amount:</span>
                    <span className="font-semibold text-base sm:text-lg">
                      {formatCurrency(selectedAmount || Number.parseInt(customAmount) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-500">Processing Fee:</span>
                    <span className="text-slate-500">Included</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900 text-sm sm:text-base">Total:</span>
                      <span className="font-bold text-lg sm:text-xl text-indigo-600">
                        {formatCurrency(selectedAmount || Number.parseInt(customAmount) || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-slate-200 text-slate-700 py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate USSD Code</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: USSD Payment - Fixed Responsiveness */}
          {step === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Complete Payment</h3>

              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  {paymentMethod === "orange-money" ? "Orange Money" : "Africell Money"} Payment
                </h4>
                <p className="text-slate-600 text-sm sm:text-base">
                  Dial the USSD code below on your {paymentMethod === "orange-money" ? "Orange" : "Africell"} line
                </p>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                  <span className="font-medium text-slate-700 text-sm sm:text-base">USSD Code:</span>
                  <button
                    onClick={copyUSSDCode}
                    className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                      copied
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white border-2 border-dashed border-indigo-300 rounded-xl p-3 sm:p-6 text-center overflow-x-auto">
                  <code className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-slate-900 tracking-wider whitespace-nowrap">
                    {ussdCode}
                  </code>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                <h5 className="font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-xs sm:text-sm font-bold">i</span>
                  </div>
                  Payment Instructions:
                </h5>
                <ol className="text-xs sm:text-sm text-blue-800 space-y-1 sm:space-y-2">
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      1
                    </span>
                    Copy the USSD code above
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      2
                    </span>
                    Open your phone dialer
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      3
                    </span>
                    Dial the USSD code and press call
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      4
                    </span>
                    Follow the prompts to complete payment
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5 flex-shrink-0">
                      5
                    </span>
                    You&apos;ll receive a confirmation SMS
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 sm:p-4 border border-slate-200">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-600">Amount to Pay:</span>
                    <p className="font-semibold text-sm sm:text-base">
                      {formatCurrency(selectedAmount || Number.parseInt(customAmount) || 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">Phone Number:</span>
                    <p className="font-semibold text-sm sm:text-base">{donorInfo.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 border-2 border-slate-200 text-slate-700 py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleDonate}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="whitespace-nowrap">I&apos;ve Paid</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Payment Confirmation */}
          {step === 5 && (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Thank You for Your Donation! 🎉</h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  Your generosity makes a real difference. You&apos;ll receive a confirmation email shortly.
                </p>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 sm:p-6 text-left border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                  Donation Summary
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-xs sm:text-sm">Campaign:</span>
                    <span className="font-medium text-right max-w-32 sm:max-w-48 truncate text-xs sm:text-sm">{campaign.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-xs sm:text-sm">Amount:</span>
                    <span className="font-bold text-base sm:text-lg text-green-600">
                      {formatCurrency(selectedAmount || Number.parseInt(customAmount) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-xs sm:text-sm">Payment Method:</span>
                    <span className="font-medium text-xs sm:text-sm">
                      {paymentMethod === "orange-money" ? "Orange Money" : "Africell Money"}
                    </span>
                  </div>
                  {!donorInfo.anonymous && donorInfo.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-xs sm:text-sm">Receipt sent to:</span>
                      <span className="font-medium text-right max-w-32 sm:max-w-48 truncate text-xs sm:text-sm">{donorInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                <h5 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">What happens next:</h5>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1 text-left">
                  <li>• Your donation will be processed within 24 hours</li>
                  <li>• The campaign organizer will be notified</li>
                  <li>• You&apos;ll receive updates on the campaign&apos;s progress</li>
                  <li>• A tax receipt will be emailed to you if applicable</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg text-sm sm:text-base"
              >
                Done
              </button>
            </div>
          )}

          {step < 5 && (
            <div className="mt-6 sm:mt-8 flex items-center justify-center text-xs text-slate-500 bg-slate-50 rounded-lg p-2 sm:p-3">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="text-xs sm:text-sm">Your payment is secure and encrypted with 256-bit SSL</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}