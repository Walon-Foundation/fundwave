import Link from "next/link"
import { Mail, AlertTriangle, Home, HelpCircle } from "lucide-react"

export default function AccountDeletedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-sky-500 rounded-sm"></div>
              </div>
            </div>
            <span className="text-2xl font-bold text-slate-900">FundWaveSL</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Account Deleted</h1>

          {/* Description */}
          <p className="text-slate-600 mb-6 leading-relaxed">
            Your FundWaveSL account has been permanently deleted. All your data, campaigns, and associated information
            have been removed from our system.
          </p>

          {/* Email Notification */}
          <div className="bg-slate-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-slate-700">Email Confirmation Sent</span>
            </div>
            <p className="text-sm text-slate-600">
              A confirmation email has been sent to your registered email address with details about the account
              deletion.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">Important Notice</h3>
            <ul className="text-sm text-amber-700 text-left space-y-1">
              <li>• This action cannot be undone</li>
              <li>• All active campaigns have been closed</li>
              <li>• Pending donations have been refunded</li>
              <li>• Your data has been permanently removed</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="w-full btn-primary flex items-center justify-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <Link href="/contact" className="w-full btn-outline flex items-center justify-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>Contact Support</span>
            </Link>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-slate-500 mt-6">
            If you believe this was done in error, please contact our support team immediately.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">Thank you for being part of the FundWaveSL community.</p>
        </div>
      </div>
    </div>
  )
}
