"use client"

import type React from "react"
import { useState } from "react"
import { X, DollarSign, CheckCircle, AlertCircle, Smartphone, Clock, Shield, ArrowRight } from "lucide-react"

interface CashoutModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: {
    id: string
    name: string
    donated: number
  }
}

export default function CashoutModal({ isOpen, onClose, campaign }: CashoutModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "NLe",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(076|077|078|030|031|032|033|034|025|088|075)\d{6}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
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

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setShowConfirmation(true)
    } catch (err) {
      setError("Failed to process cashout. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setPhoneNumber("")
    setShowConfirmation(false)
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {!showConfirmation ? (
          <>
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Available Amount Display */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-800 mb-2">Available to cashout:</p>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(campaign.donated)}</p>
                <p className="text-xs text-green-700 mt-2">Funds ready for withdrawal</p>
              </div>

              {/* Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-blue-600 text-sm font-bold">i</span>
                  </div>
                  Important Information
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Funds will be sent to your mobile money account</li>
                  <li>• Processing time: 1-24 hours</li>
                  <li>• You'll receive SMS confirmation when complete</li>
                  <li>• A receipt will be emailed to your registered email</li>
                </ul>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Money Number *
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
                      placeholder="076 XXX XXXX"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                    <span>Supported: Orange Money, Africell Money</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3">Transaction Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Campaign:</span>
                      <span className="font-medium text-right max-w-32 truncate">{campaign.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Gross Amount:</span>
                      <span className="font-semibold">{formatCurrency(campaign.donated)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Platform Fee (5%):</span>
                      <span className="text-slate-500">-{formatCurrency(campaign.donated * 0.05)}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900">Net Amount:</span>
                        <span className="font-bold text-xl text-green-600">
                          {formatCurrency(campaign.donated * 0.95)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Funds</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security Notice */}
              <div className="flex items-center justify-center text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                <Shield className="w-4 h-4 mr-2" />
                <span>All transactions are secure and encrypted</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success Confirmation */}
            <div className="p-6 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Funds Sent Successfully! 🎉</h2>
                <p className="text-slate-600">Your cashout request has been processed and is on its way.</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-800 mb-1">Amount Sent:</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(campaign.donated * 0.95)}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-1">Sent to:</p>
                  <p className="text-lg font-semibold text-green-900">{phoneNumber}</p>
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
                    <span>Funds will be processed within 1-24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>A confirmation email has been sent to your registered email</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>You'll receive an SMS confirmation once the transfer is complete</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Contact support if you don't receive funds within 48 hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800">
                  If you have any questions or concerns about your cashout, please contact our support team at{" "}
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
            </div>
          </>
        )}
      </div>
    </div>
  )
}
