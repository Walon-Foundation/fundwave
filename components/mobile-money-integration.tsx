"use client"

import { useState } from "react"
import { Smartphone, Shield, CheckCircle } from "lucide-react"

interface MobileMoneyProvider {
  id: string
  name: string
  logo: string
  color: string
  fees: string
  processingTime: string
  supported: boolean
}

const mobileMoneyProviders: MobileMoneyProvider[] = [
  {
    id: "orange",
    name: "Orange Money",
    logo: "🟠",
    color: "bg-orange-500",
    fees: "1.5%",
    processingTime: "Instant",
    supported: true,
  },
  {
    id: "africell",
    name: "Africell Money",
    logo: "🔵",
    color: "bg-blue-500",
    fees: "1.2%",
    processingTime: "Instant",
    supported: true,
  },
  {
    id: "qmoney",
    name: "QMoney",
    logo: "🟢",
    color: "bg-green-500",
    fees: "1.8%",
    processingTime: "2-5 minutes",
    supported: true,
  },
  {
    id: "splash",
    name: "Splash Mobile Money",
    logo: "🟣",
    color: "bg-purple-500",
    fees: "2.0%",
    processingTime: "Instant",
    supported: false,
  },
]

interface MobileMoneyIntegrationProps {
  amount: number
  onPaymentComplete: (paymentData: any) => void
  onCancel: () => void
}

export default function MobileMoneyIntegration({ amount, onPaymentComplete, onCancel }: MobileMoneyIntegrationProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"select" | "details" | "confirm" | "processing" | "success">("select")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setStep("details")
  }

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 8) {
      setStep("confirm")
    }
  }

  const handlePayment = async () => {
    setStep("processing")
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setStep("success")
      setIsProcessing(false)

      // Simulate payment completion
      setTimeout(() => {
        onPaymentComplete({
          provider: selectedProvider,
          phoneNumber,
          amount,
          transactionId: `TXN${Date.now()}`,
          status: "completed",
        })
      }, 2000)
    }, 3000)
  }

  const selectedProviderData = mobileMoneyProviders.find((p) => p.id === selectedProvider)

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Mobile Money Payment</h2>
            <p className="text-indigo-100">Secure and instant payments</p>
          </div>
          <Smartphone className="w-8 h-8" />
        </div>
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold">{formatCurrency(amount)}</div>
        </div>
      </div>

      <div className="p-6">
        {step === "select" && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Payment Method</h3>
            <div className="space-y-3">
              {mobileMoneyProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => provider.supported && handleProviderSelect(provider.id)}
                  disabled={!provider.supported}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    provider.supported
                      ? "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                      : "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{provider.logo}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{provider.name}</div>
                        <div className="text-sm text-slate-600">
                          Fee: {provider.fees} • {provider.processingTime}
                        </div>
                      </div>
                    </div>
                    {provider.supported ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Coming Soon</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure Payments</h4>
                  <p className="text-sm text-blue-700">
                    All transactions are encrypted and processed through secure mobile money gateways.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "details" && selectedProviderData && (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <button onClick={() => setStep("select")} className="text-slate-600 hover:text-slate-800">
                ←
              </button>
              <div className="text-2xl">{selectedProviderData.logo}</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedProviderData.name}</h3>
                <p className="text-sm text-slate-600">Enter your mobile number</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500">+232</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="76 123 456"
                    className="input pl-16"
                    maxLength={9}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Enter your {selectedProviderData.name} registered number</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Processing Fee</span>
                    <span className="font-medium">{formatCurrency(amount * 0.015)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(amount + amount * 0.015)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length < 8}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && selectedProviderData && (
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{selectedProviderData.logo}</div>
              <h3 className="text-lg font-semibold text-slate-900">Confirm Payment</h3>
              <p className="text-slate-600">Review your payment details</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Provider</span>
                  <span className="font-medium">{selectedProviderData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mobile Number</span>
                  <span className="font-medium">+232 {phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Fee</span>
                  <span className="font-medium">{formatCurrency(amount * 0.015)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(amount + amount * 0.015)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handlePayment} className="btn-primary w-full">
                Confirm Payment
              </button>
              <button onClick={() => setStep("details")} className="btn-outline w-full">
                Back
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Payment</h3>
            <p className="text-slate-600 mb-4">Please wait while we process your payment...</p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                You will receive an SMS prompt on your mobile device. Please follow the instructions to complete the
                payment.
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Successful!</h3>
            <p className="text-slate-600 mb-4">Your donation has been processed successfully.</p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-800">
                Transaction ID: TXN{Date.now()}
                <br />
                You will receive a confirmation SMS shortly.
              </p>
            </div>
          </div>
        )}

        {step !== "success" && step !== "processing" && (
          <button onClick={onCancel} className="w-full mt-4 text-slate-600 hover:text-slate-800 text-sm">
            Cancel Payment
          </button>
        )}
      </div>
    </div>
  )
}
