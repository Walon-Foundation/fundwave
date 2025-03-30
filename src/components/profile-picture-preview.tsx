"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface ProfilePicturePreviewProps {
  onImageChange?: (file: File | null) => void
}

export default function ProfilePicturePreview({ onImageChange }: ProfilePicturePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange?.(file)
    } else {
      setPreviewUrl(null)
      onImageChange?.(null)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="profilePicture" className="text-blue-800">
        Profile Picture
      </Label>

      <div className="flex flex-col items-center">
        <div
          className="w-32 h-32 rounded-full border-2 border-blue-200 overflow-hidden flex items-center justify-center bg-blue-50 mb-3"
          onClick={handleButtonClick}
        >
          {previewUrl ? (
            <Image src={previewUrl || "/placeholder.svg"} width={50} height={50} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <Camera className="h-10 w-10 text-blue-300" />
          )}
        </div>

        <input
          ref={fileInputRef}
          id="profilePicture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
          onClick={handleButtonClick}
        >
          {previewUrl ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>
    </div>
  )
}

