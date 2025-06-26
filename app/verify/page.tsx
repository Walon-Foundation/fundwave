"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Mail, Clock, CheckCircle,} from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("value")

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-azure-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=60&width=60')] opacity-5"></div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-ocean-600 to-azure-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-2xl font-bold gradient-text">FundWaveSL</span>
              </div>
            </Link>
          </div>

          {/* Main Card */}
          <Card className="glass-effect border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-ocean-100 to-azure-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-ocean-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">Check Your Email</CardTitle>
                <CardDescription className="text-slate-600 mt-2">
                  We've sent a verification link to your email address
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Email Display */}
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Verification email sent to:</p>
                <p className="font-semibold text-ocean-700 bg-ocean-50 px-4 py-2 rounded-lg border border-ocean-200">
                    {email}
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Next Steps:
                  </h3>
                  <ol className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start">
                      <span className="bg-ocean-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        1
                      </span>
                      Check your email inbox for a message from FundWaveSL
                    </li>
                    <li className="flex items-start">
                      <span className="bg-ocean-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        2
                      </span>
                      Click the verification link in the email
                    </li>
                    {/* <li className="flex items-start">
                      <span className="bg-ocean-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        3
                      </span>
                      Complete your account setup
                    </li> */}
                  </ol>
                </div>

                {/* Spam Folder Notice */}
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Can't find the email?</strong> Check your spam or junk folder. The email should arrive
                    within a few minutes.
                  </AlertDescription>
                </Alert>
              </div>

              
              {/* Back to Login */}
              <div className="pt-4 border-t border-slate-200">
                <Link href="/login">
                  <Button variant="ghost" className="w-full text-slate-600 hover:text-slate-900">
                    ← Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              By verifying your email, you agree to our{" "}
              <Link href="/terms" className="text-ocean-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-ocean-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
