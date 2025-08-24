"use client"

import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="text-9xl font-bold text-slate-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-slate-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the
            wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/" className="btn-primary w-full flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>

          <Link href="/campaigns" className="btn-outline w-full flex items-center justify-center">
            <Search className="w-4 h-4 mr-2" />
            Browse Campaigns
          </Link>

          <button onClick={() => window.history.back()} className="btn-outline w-full flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12 text-sm text-slate-500">
          <p>
            Need help?{" "}
            <Link href="/contact" className="text-indigo-600 hover:text-indigo-800">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
