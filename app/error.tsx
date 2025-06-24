"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RefreshCw, Home, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Something went wrong!</h1>
          <p className="text-lg text-slate-600 mb-8">
            We encountered an unexpected error. Don&apos;t worry, our team has been notified and we&apos;re working to fix it.
          </p>
        </div>

        <div className="space-y-4">
          <button onClick={reset} className="btn-primary w-full flex items-center justify-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>

          <Link href="/" className="btn-outline w-full flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>

        <div className="mt-12 text-sm text-slate-500">
          <p>Error ID: {error.digest}</p>
          <p className="mt-2">
            If this problem persists, please{" "}
            <Link href="/contact" className="text-indigo-600 hover:text-indigo-800">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
