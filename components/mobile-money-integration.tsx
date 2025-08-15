"use client"

import { useState } from "react"
import { Smartphone, Shield, CheckCircle, ArrowLeft, CreditCard, Clock, Zap } from "lucide-react"

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
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Mobile Money Payment</h2>
              <p className="text-indigo-100 text-sm sm:text-base opacity-90">Secure and instant payments</p>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Smartphone className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-3xl sm:text-4xl font-bold mb-1">{formatCurrency(amount)}</div>
            <div className="text-indigo-200 text-sm font-medium">Payment Amount</div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {step === "select" && (
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Choose Payment Method</h3>
            <p className="text-slate-600 mb-8 text-sm sm:text-base">Select your preferred mobile money provider</p>
            <div className="space-y-4">
              {mobileMoneyProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => provider.supported && handleProviderSelect(provider.id)}
                  disabled={!provider.supported}
                  className={`w-full p-5 sm:p-6 border-2 rounded-2xl text-left transition-all duration-300 group ${
                    provider.supported
                      ? "border-slate-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:shadow-xl transform hover:-translate-y-1 active:scale-[0.98]"
                      : "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl sm:text-3xl shadow-sm">
                        {provider.logo}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base sm:text-lg mb-1">{provider.name}</div>
                        <div className="text-xs sm:text-sm text-slate-600 flex items-center space-x-4">
                          <span className="flex items-center bg-slate-100 px-2 py-1 rounded-full">
                            <CreditCard className="w-3 h-3 mr-1" />
                            {provider.fees}
                          </span>
                          <span className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3 mr-1" />
                            {provider.processingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    {provider.supported ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 bg-slate-200 px-3 py-1.5 rounded-full font-medium">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-base sm:text-lg mb-2">Bank-Level Security</h4>
                  <p className="text-sm sm:text-base text-blue-800 leading-relaxed">
                    All transactions are encrypted end-to-end and processed through certified mobile money gateways with
                    advanced fraud protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "details" && selectedProviderData && (
          <div>
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={() => setStep("select")}
                className="p-3 hover:bg-slate-100 rounded-xl transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
              </button>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-sm">
                {selectedProviderData.logo}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedProviderData.name}</h3>
                <p className="text-sm sm:text-base text-slate-600">Enter your mobile number</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-base font-bold text-slate-800 mb-4">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-slate-700 font-bold text-base">+232</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="76 123 456"
                    className="w-full pl-20 pr-5 py-4 sm:py-5 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-base sm:text-lg font-medium bg-slate-50 focus:bg-white"
                    maxLength={9}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-3 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Enter your {selectedProviderData.name} registered number
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 sm:p-8 rounded-2xl border-2 border-slate-200">
                <h4 className="font-bold text-slate-900 mb-6 flex items-center text-lg">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </div>
                  Payment Summary
                </h4>
                <div className="space-y-4 text-base">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 font-medium">Amount</span>
                    <span className="font-bold text-slate-900">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 font-medium">Processing Fee ({selectedProviderData.fees})</span>
                    <span className="font-bold text-slate-900">{formatCurrency(amount * 0.015)}</span>
                  </div>
                  <div className="border-t-2 border-slate-300 pt-4 flex justify-between items-center font-bold text-lg">
                    <span className="text-slate-900">Total</span>
                    <span className="text-indigo-600 text-xl">{formatCurrency(amount + amount * 0.015)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length < 8}
                className="w-full py-4 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 active:scale-[0.98] text-base sm:text-lg"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === "confirm" && selectedProviderData && (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-4xl sm:text-5xl">{selectedProviderData.logo}</div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Confirm Payment</h3>
              <p className="text-slate-600 text-base">Review your payment details carefully</p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 sm:p-8 rounded-2xl mb-8 border-2 border-slate-200">
              <div className="space-y-5">
                {[
                  { label: "Provider", value: selectedProviderData.name },
                  { label: "Mobile Number", value: `+232 ${phoneNumber}` },
                  { label: "Amount", value: formatCurrency(amount) },
                  { label: "Fee", value: formatCurrency(amount * 0.015) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2">
                    <span className="text-slate-600 font-medium text-base">{label}</span>
                    <span className="font-bold text-slate-900 text-base">{value}</span>
                  </div>
                ))}
                <div className="border-t-2 border-slate-300 pt-5 flex justify-between items-center font-bold text-lg">
                  <span className="text-slate-900">Total Payment</span>
                  <span className="text-indigo-600 text-xl">{formatCurrency(amount + amount * 0.015)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handlePayment}
                className="w-full py-4 sm:py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl transform hover:-translate-y-0.5 active:scale-[0.98] text-base sm:text-lg"
              >
                <Zap className="w-5 h-5 inline mr-3" />
                Confirm Payment
              </button>
              <button
                onClick={() => setStep("details")}
                className="w-full py-4 sm:py-5 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-bold rounded-2xl transition-all text-base"
              >
                Back to Edit
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Processing Payment</h3>
            <p className="text-slate-600 mb-8 text-base leading-relaxed">
              Please wait while we securely process your payment...
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 rounded-2xl border-2 border-amber-200">
              <p className="text-base text-amber-800 leading-relaxed font-medium">
                📱 You will receive an SMS prompt on your mobile device. Please follow the instructions to complete the
                payment.
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Payment Successful!</h3>
            <p className="text-slate-600 mb-8 text-base">Your donation has been processed successfully.</p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 sm:p-8 rounded-2xl mb-6 border-2 border-green-200">
              <p className="text-base text-green-800 leading-relaxed font-medium">
                <strong>Transaction ID:</strong> TXN{Date.now()}
                <br />📧 You will receive a confirmation SMS and email shortly.
              </p>
            </div>
          </div>
        )}

        {step !== "success" && step !== "processing" && (
          <button
            onClick={onCancel}
            className="w-full mt-6 sm:mt-8 py-3 text-slate-600 hover:text-slate-800 font-medium text-base transition-colors hover:bg-slate-50 rounded-xl"
          >
            Cancel Payment
          </button>
        )}
      </div>
    </div>
  )
}
