"use client"

import type React from "react"
import { useState } from "react"
import { X, DollarSign, CheckCircle, AlertCircle, Smartphone, Clock, Shield, ArrowRight } from "lucide-react"
import { api } from "@/lib/api/api"

interface CashoutModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: {
    id: string
    name: string
    donated: number
  }
}

type Provider = "orange" | "africell" | ""

export default function CashoutModal({ isOpen, onClose, campaign }: CashoutModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [cashoutAmount, setCashoutAmount] = useState("")
  const [provider, setProvider] = useState<Provider>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState("")
  const [useFullAmount, setUseFullAmount] = useState(true)
  const [currentStep, setCurrentStep] = useState(1) // 1: Provider, 2: Details, 3: Confirmation

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLE",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(076|077|078|030|031|032|033|034|025|088|075)\d{6}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setCashoutAmount(value)
  }

  const handleFullAmountToggle = () => {
    setUseFullAmount(!useFullAmount)
    if (!useFullAmount) {
      setCashoutAmount("")
    }
  }

  const amount = useFullAmount ? campaign?.donated : Number(cashoutAmount)

  const handleProviderSelect = (selectedProvider: Provider) => {
    setProvider(selectedProvider)
    setCurrentStep(2)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!phoneNumber.trim()) {
      setError("Please enter your mobile money number")
      return
    }

    if (!validatePhone(phoneNumber)) {
      setError("Please enter a valid Sierra Leone mobile number")
      return
    }

    if (!useFullAmount && (!cashoutAmount || Number(cashoutAmount) <= 0)) {
      setError("Please enter a valid amount to cashout")
      return
    }
    
    if (amount > campaign.donated) {
      setError("Amount cannot exceed available funds")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call with the amount
      const body =  {
        phoneNumber,
        amount,
        provider
      }

      console.log(body)
      await api.makeWithdrawal(body, campaign.id)
      setShowConfirmation(true)
      setCurrentStep(3)
    } catch (err) {
      setError("Failed to process cashout. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setPhoneNumber("")
    setCashoutAmount("")
    setProvider("")
    setUseFullAmount(true)
    setShowConfirmation(false)
    setError("")
    setCurrentStep(1)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Cashout Funds</h2>
              <p className="text-sm text-slate-600 max-w-48 truncate">{campaign.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step 
                    ? "bg-green-600 text-white" 
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {step}
                </div>
                <span className="text-xs mt-1 text-slate-600">
                  {step === 1 ? "Provider" : step === 2 ? "Details" : "Confirm"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Provider Selection */}
          {currentStep === 1 && (
            <>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Select Mobile Money Provider</h3>
                <p className="text-slate-600">Choose where you want to receive your funds</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleProviderSelect("orange")}
                  className="p-4 border-2 border-orange-200 rounded-xl hover:border-orange-400 transition-all flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-orange-600 font-bold">O</span>
                  </div>
                  <span className="font-medium">Orange Money</span>
                </button>

                <button
                  onClick={() => handleProviderSelect("africell")}
                  className="p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition-all flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-purple-600 font-bold">A</span>
                  </div>
                  <span className="font-medium">Africell Money</span>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Details Form */}
          {currentStep === 2 && (
            <>
              {/* Available Amount Display */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-800 mb-2">Available to cashout:</p>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(campaign.donated)}</p>
                <p className="text-xs text-green-700 mt-2">Funds ready for withdrawal</p>
              </div>

              {/* Amount Selection */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fullAmount"
                    checked={useFullAmount}
                    onChange={handleFullAmountToggle}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fullAmount" className="ml-2 block text-sm text-gray-900">
                    Cash out full amount
                  </label>
                </div>

                {!useFullAmount && (
                  <div>
                    <label htmlFor="cashoutAmount" className="block text-sm font-medium text-slate-700 mb-2">
                      Enter amount to cashout *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="cashoutAmount"
                        value={cashoutAmount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    {provider === "orange" ? "Orange Money" : "Africell Money"} Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        setError("")
                      }}
                      placeholder={provider === "orange" ? "076 XXX XXXX" : "077 XXX XXXX"}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">Transaction Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Provider:</span>
                      <span className="font-medium text-right">
                        {provider === "orange" ? "Orange Money" : "Africell Money"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Amount to cashout:</span>
                      <span className="font-semibold">
                        {formatCurrency(useFullAmount ? campaign.donated : Number(cashoutAmount) || 0)}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900">Net Amount:</span>
                        <span className="font-bold text-xl text-green-600">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim() || (!useFullAmount && !cashoutAmount)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Cashout Request Submitted! 🎉</h2>
                <p className="text-slate-600">Your request is being processed. We&pos;ve sent a confirmation email with details.</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-800 mb-1">Amount Requested:</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(amount)}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-1">To be sent to:</p>
                  <p className="text-lg font-semibold text-green-900">
                    {provider === "orange" ? "Orange Money" : "Africell Money"}: {phoneNumber}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <Clock className="w-5 h-5 text-slate-600 mr-2" />
                  What happens next:
                </h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Check your email for confirmation details</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Funds will be processed within 1-24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You&apos;ll receive an SMS confirmation once the transfer is complete</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Contact support if you don&apos;t receive funds within 48 hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800">
                  If you have any questions about your cashout, please contact our support team at{" "}
                  <span className="font-semibold">support@fundwave.sl</span> or call{" "}
                  <span className="font-semibold">+232 76 XXX XXXX</span>
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-4 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg text-lg"
              >
                Done
              </button>
            </>
          )}

          {/* Security Notice */}
          {currentStep !== 3 && (
            <div className="flex items-center justify-center text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
              <Shield className="w-4 h-4 mr-2" />
              <span>All transactions are secure and encrypted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}