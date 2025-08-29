"use client"

import type React from "react"

import { useState } from "react"
import { X, DollarSign, CheckCircle } from "lucide-react"

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "NLe",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowConfirmation(true)
  }

  const handleClose = () => {
    setPhoneNumber("")
    setShowConfirmation(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Cashout Funds</h2>
                  <p className="text-sm text-slate-600">{campaign.name}</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Available to cashout:</span>
                    <span className="text-lg font-bold text-green-900">{formatCurrency(campaign.donated)}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Enter your mobile money number to receive the funds. A confirmation email will be sent to you.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Money Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your mobile money number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Example: 076 XXX XXXX</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Funds"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            {/* Success Confirmation */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-xl font-semibold text-slate-900 mb-2">Funds Sent Successfully!</h2>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 mb-2">
                  <strong>{formatCurrency(campaign.donated)}</strong> has been sent to:
                </p>
                <p className="text-lg font-medium text-green-900">{phoneNumber}</p>
              </div>

              <div className="text-left bg-slate-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-slate-900 mb-2">What happens next:</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Funds will be processed within 24 hours</li>
                  <li>• A confirmation email has been sent to your registered email</li>
                  <li>• You&apos;ll receive an SMS confirmation once the transfer is complete</li>
                  <li>• Contact support if you don&apos;t receive funds within 48 hours</li>
                </ul>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
