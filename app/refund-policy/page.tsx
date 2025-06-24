import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Shield, Clock, AlertTriangle, CheckCircle, CreditCard, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Refund Policy | FundWaveSL",
  description: "Learn about our refund policy and how to request refunds for donations on FundWaveSL.",
}

export default function RefundPolicyPage() {
  const lastUpdated = "December 24, 2024"

  const refundScenarios = [
    {
      title: "Fraudulent Campaign",
      icon: Shield,
      description: "Campaign found to be fraudulent or misleading",
      eligibility: "Full refund within 180 days",
      process: "Automatic refund after investigation",
      timeframe: "5-10 business days",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Campaign Cancelled",
      icon: RefreshCw,
      description: "Campaign creator cancels before goal is reached",
      eligibility: "Full refund available",
      process: "Automatic refund to original payment method",
      timeframe: "3-7 business days",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Duplicate Donation",
      icon: CreditCard,
      description: "Accidental duplicate payment made",
      eligibility: "Full refund within 48 hours",
      process: "Contact support with transaction details",
      timeframe: "1-3 business days",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Technical Error",
      icon: AlertTriangle,
      description: "Payment processed due to technical issue",
      eligibility: "Full refund available",
      process: "Automatic detection and refund",
      timeframe: "1-5 business days",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const refundProcess = [
    {
      step: 1,
      title: "Submit Request",
      description: "Contact our support team with your refund request and transaction details",
      icon: Mail,
    },
    {
      step: 2,
      title: "Review Process",
      description: "Our team reviews your request and verifies eligibility within 2-3 business days",
      icon: CheckCircle,
    },
    {
      step: 3,
      title: "Refund Processing",
      description: "Approved refunds are processed back to your original payment method",
      icon: CreditCard,
    },
    {
      step: 4,
      title: "Confirmation",
      description: "You'll receive email confirmation once the refund has been processed",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 text-slate-600 hover:text-ocean-600">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Refund Policy</h1>
              <p className="text-slate-600">Understanding our refund process and your rights</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Last updated: {lastUpdated}
            </div>
            <Badge variant="secondary">Version 2.1</Badge>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <AlertTriangle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Important:</strong> Donations are generally final to ensure funds reach their intended recipients.
            Refunds are only available in specific circumstances outlined below.
          </AlertDescription>
        </Alert>

        {/* General Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">General Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              At FundWaveSL, we understand that sometimes circumstances change. While donations are generally considered
              final transactions to ensure funds reach their intended recipients, we do provide refunds in specific
              situations to protect our donors and maintain trust in our platform.
            </p>

            <h3>Our Commitment</h3>
            <ul>
              <li>We investigate all refund requests thoroughly and fairly</li>
              <li>Eligible refunds are processed promptly to your original payment method</li>
              <li>We maintain transparency throughout the refund process</li>
              <li>Our support team is available to assist with any questions</li>
            </ul>
          </CardContent>
        </Card>

        {/* Refund Scenarios */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">When Refunds Are Available</h2>
          <div className="grid gap-6">
            {refundScenarios.map((scenario, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${scenario.bgColor} flex items-center justify-center`}>
                      <scenario.icon className={`w-5 h-5 ${scenario.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Eligibility</h4>
                      <p className="text-sm text-slate-600">{scenario.eligibility}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Process</h4>
                      <p className="text-sm text-slate-600">{scenario.process}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Timeframe</h4>
                      <p className="text-sm text-slate-600">{scenario.timeframe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Refund Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">How to Request a Refund</CardTitle>
            <CardDescription>Follow these steps to request a refund for your donation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {refundProcess.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ocean-500 to-azure-500 flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <h3>What You Need to Know</h3>
            <ul>
              <li>
                <strong>Processing Time:</strong> Refunds typically take 3-10 business days depending on your payment
                method
              </li>
              <li>
                <strong>Payment Method:</strong> Refunds are processed back to your original payment method
              </li>
              <li>
                <strong>Transaction Fees:</strong> Processing fees may not be refundable in some cases
              </li>
              <li>
                <strong>Documentation:</strong> You may need to provide transaction details or screenshots
              </li>
              <li>
                <strong>Investigation:</strong> Some refund requests may require investigation before approval
              </li>
            </ul>

            <h3>Refunds Not Available For</h3>
            <ul>
              <li>Change of mind after successful campaign completion</li>
              <li>Disagreement with how funds were used (unless fraudulent)</li>
              <li>Donations made more than 180 days ago (except in fraud cases)</li>
              <li>Donations to campaigns that have already distributed funds</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Need Help with a Refund?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              If you believe you're eligible for a refund or have questions about our refund policy, please don't
              hesitate to contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="btn-primary">
                <Link href="/contact">Request Refund</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/help">Help Center</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="mailto:support@fundwavesl.com">Email Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
