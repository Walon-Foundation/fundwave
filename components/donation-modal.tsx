"use client"

import type React from "react"

import { useState } from "react"
import { X, CreditCard, Smartphone, Building, Lock, Calendar, User } from "lucide-react"

interface DonationModalProps {
  campaign: {
    id: string
    title: string
    creator: {
      name: string
    }
  }
  onClose: () => void
}

const donationAmounts = [25000, 50000, 100000, 250000, 500000, 1000000]

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
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [step, setStep] = useState(1) // 1: Amount, 2: Payment, 3: Details

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleNext = () => {
    const amount = selectedAmount || Number.parseInt(customAmount)
    if (!amount || amount < 10000) {
      alert("Minimum donation amount is SLL 10,000")
      return
    }
    setStep(step + 1)
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = selectedAmount || Number.parseInt(customAmount)

    // Mock donation API call
    console.log("Processing donation:", {
      campaignId: campaign.id,
      amount,
      paymentMethod,
      donorInfo,
      cardInfo: paymentMethod === "credit-card" ? cardInfo : null,
    })

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Thank you for your donation! You will receive a confirmation email shortly.")
    onClose()
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Make a Donation</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-indigo-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Campaign Info */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-1">{campaign.title}</h3>
            <p className="text-sm text-slate-600">by {campaign.creator.name}</p>
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
                  placeholder="Enter amount in SLL"
                  className="input"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(null)
                  }}
                  min="10000"
                />
              </div>

              <button onClick={handleNext} className="btn-primary w-full">
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

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={paymentMethod === "credit-card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-3 text-green-500" />
                  <div>
                    <span className="font-medium">Credit/Debit Card</span>
                    <p className="text-sm text-slate-600">Visa, Mastercard, American Express</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={paymentMethod === "bank-transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Building className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <span className="font-medium">Bank Transfer</span>
                    <p className="text-sm text-slate-600">Direct bank transfer</p>
                  </div>
                </label>
              </div>

              <div className="flex space-x-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Details */}
          {step === 3 && (
            <form onSubmit={handleDonate}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Details</h3>

              {/* Credit Card Form */}
              {paymentMethod === "credit-card" && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input pl-10"
                        value={cardInfo.number}
                        onChange={(e) => setCardInfo({ ...cardInfo, number: formatCardNumber(e.target.value) })}
                        maxLength={19}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="input pl-10"
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiry: formatExpiry(e.target.value) })}
                          maxLength={5}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="123"
                          className="input pl-10"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, "") })}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="input pl-10"
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Money Form */}
              {(paymentMethod === "orange-money" || paymentMethod === "africell-money") && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+232 XX XXX XXXX"
                    className="input"
                    value={donorInfo.phone}
                    onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                    required
                  />
                </div>
              )}

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
                      className="input"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="input"
                      value={donorInfo.email}
                      onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
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
                <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">
                  Back
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Donate Now
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 flex items-center justify-center text-xs text-slate-500">
            <Lock className="w-3 h-3 mr-1" />
            Your payment is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  )
}
