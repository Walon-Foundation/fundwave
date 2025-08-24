"use client"

import type React from "react"
import { useState } from "react"
import { X, Smartphone, Lock, Copy, CheckCircle, Mail } from "lucide-react"
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "NLe",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleNext = () => {
    const amount = selectedAmount || Number.parseInt(customAmount)
    if (!amount || amount < 1) {
      alert("Minimum donation amount is NLe 1")
      return
    }
    setStep(step + 1)
  }

  const handlePaymentDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await api.createPayment({
        name: donorInfo.name || undefined,
        amount: selectedAmount || Number.parseInt(customAmount),
        phone: donorInfo.phone,
        email: donorInfo.email,
        isAnonymous:donorInfo.anonymous
      }, campaign.id)

      console.log(data)
      setUssdCode(data)
      setStep(4)
    } catch (error) {
      console.error("Error generating USSD code:", error)
      alert("Failed to generate payment code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDonate = () => {
    // Directly show confirmation without verification
    setStep(5)
  }

  const copyUSSDCode = async () => {
    try {
      await navigator.clipboard.writeText(ussdCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Make a Donation</h2>
            <button className="text-slate-400 hover:text-slate-600" onClick={() => onClose()}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mb-6">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div className={`w-8 h-1 mx-1 ${step > stepNumber ? "bg-indigo-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Campaign Info */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-1">{campaign.title}</h3>
            <p className="text-sm text-slate-600">by {campaign.organizer}</p>
          </div>

          {/* Step 1: Amount Selection */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Donation Amount</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount("")
                    }}
                    className={`p-3 rounded-lg border text-center font-medium transition-colors ${
                      selectedAmount === amount
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Or enter custom amount</label>
                <input
                  type="number"
                  placeholder="Enter amount in  NLe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(null)
                  }}
                  min="1"
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Payment Method</h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="orange-money"
                    checked={paymentMethod === "orange-money"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Smartphone className="w-5 h-5 mr-3 text-orange-500" />
                  <div>
                    <span className="font-medium">Orange Money</span>
                    <p className="text-sm text-slate-600">Pay with your Orange Money wallet</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="africell-money"
                    checked={paymentMethod === "africell-money"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Smartphone className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <span className="font-medium">Africell Money</span>
                    <p className="text-sm text-slate-600">Pay with your Africell Money wallet</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50 opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    disabled
                    className="mr-3"
                  />
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-400">SOON</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-400">Credit/Debit Card</span>
                      <p className="text-sm text-slate-400">Coming soon</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Details */}
          {step === 3 && (
            <form onSubmit={handlePaymentDetails}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Details</h3>

              {/* Mobile Money Form */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+232 XX XXX XXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                  required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full mt-3 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    required
                  />
              </div>

              {/* Donor Information */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={donorInfo.anonymous}
                    onChange={(e) => setDonorInfo({ ...donorInfo, anonymous: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="anonymous" className="text-sm text-slate-700">
                    Make this donation anonymous
                  </label>
                </div>

                {!donorInfo.anonymous && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Donation Amount:</span>
                  <span className="font-semibold">
                    {formatCurrency(selectedAmount || Number.parseInt(customAmount) || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Processing Fee:</span>
                  <span className="text-slate-600">
                    {formatCurrency((selectedAmount || Number.parseInt(customAmount) || 0) * 0.025)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">
                      {formatCurrency((selectedAmount || Number.parseInt(customAmount) || 0) * 1.025)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : null}
                  Generate USSD Code
                </button>
              </div>
            </form>
          )}

          {/* Step 4: USSD Payment */}
          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Complete Payment</h3>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  {paymentMethod === "orange-money" ? "Orange Money" : "Africell Money"} Payment
                </h4>
                <p className="text-slate-600 text-sm">
                  Dial the USSD code below on your {paymentMethod === "orange-money" ? "Orange" : "Africell"} line to
                  complete your donation
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">USSD Code:</span>
                  <button
                    onClick={copyUSSDCode}
                    className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <code className="text-2xl font-mono font-bold text-slate-900">{ussdCode}</code>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h5 className="font-semibold text-blue-900 mb-2">Instructions:</h5>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Copy the USSD code above</li>
                  <li>2. Open your phone dialer</li>
                  <li>3. Dial the USSD code</li>
                  <li>4. Follow the prompts to complete payment</li>
                  <li>5. You&apos;ll receive a confirmation SMS</li>
                </ol>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Amount to Pay:</span>
                  <span className="font-semibold">
                    {formatCurrency((selectedAmount || Number.parseInt(customAmount) || 0))} + Charges
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Phone Number:</span>
                  <span className="font-semibold">{donorInfo.phone}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDonate}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  I&apos;ve Completed Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Payment Confirmation */}
          {step === 5 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Thank You for Your Donation!
              </h3>
              
              <p className="text-slate-600 mb-6">
                You will receive a confirmation email shortly with your receipt. 
                Please check your inbox (and spam folder) for the confirmation.
              </p>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-slate-900 mb-2">Donation Summary:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Campaign:</span>
                    <span className="font-medium">{campaign.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedAmount || Number.parseInt(customAmount) || 0)}
                    </span>
                  </div>
                  {!donorInfo.anonymous && donorInfo.email && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Confirmation sent to:</span>
                      <span className="font-medium">{donorInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {step < 5 && (
            <div className="mt-6 flex items-center justify-center text-xs text-slate-500">
              <Lock className="w-3 h-3 mr-1" />
              Your payment is secure and encrypted
            </div>
          )}
        </div>
      </div>
    </div>
  )
}