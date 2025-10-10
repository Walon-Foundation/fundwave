"use client"

import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./button"

export function LoadingSpinner({ size = "default", className = "" }: { size?: "sm" | "default" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8", 
    lg: "w-12 h-12"
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-gray-500`} />
    </div>
  )
}

export function ErrorState({ 
  message = "Something went wrong", 
  onRetry,
  className = "" 
}: { 
  message?: string
  onRetry?: () => void
  className?: string 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ 
  title = "No data found",
  description = "There's nothing here yet.",
  className = "" 
}: { 
  title?: string
  description?: string
  className?: string 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}