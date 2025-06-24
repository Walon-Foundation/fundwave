"use client"

import { useState } from "react"
import { Share2, Facebook, Twitter, MessageCircle, Mail, Copy, Check } from "lucide-react"

interface SocialSharingProps {
  campaignId: string
  campaignTitle: string
  campaignDescription: string
  campaignImage?: string
  raised: number
  target: number
  compact?: boolean
}

export default function SocialSharing({
  campaignId,
  campaignTitle,
  campaignDescription,
  campaignImage,
  raised,
  target,
  compact = false,
}: SocialSharingProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const campaignUrl = `https://fundwavesl.com/campaigns/${campaignId}`
  const progress = Math.round((raised / target) * 100)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-SL", {
      style: "currency",
      currency: "SLL",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const shareText = `Help support "${campaignTitle}" - ${progress}% funded! ${formatCurrency(raised)} raised of ${formatCurrency(target)} goal. Every donation makes a difference! 🇸🇱`

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(campaignUrl)}&hashtags=FundWaveSL,SierraLeone,Crowdfunding`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${campaignUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(`Support: ${campaignTitle}`)}&body=${encodeURIComponent(`${shareText}\n\nView campaign: ${campaignUrl}`)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], "_blank", "width=600,height=400")

    // Track sharing analytics
    console.log(`Shared campaign ${campaignId} on ${platform}`)
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-4">
              <h4 className="font-medium text-slate-900 mb-3">Share this campaign</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center space-x-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-sm">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center space-x-2 p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="text-sm">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center space-x-2 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare("email")}
                  className="flex items-center space-x-2 p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </button>
              </div>
              <div className="mt-3 pt-3 border-t">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Share2 className="w-6 h-6 text-indigo-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Share this Campaign</h3>
          <p className="text-sm text-slate-600">Help spread the word and reach more supporters</p>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          {campaignImage && (
            <img
              src={campaignImage || "/placeholder.svg"}
              alt={campaignTitle}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 truncate">{campaignTitle}</h4>
            <p className="text-sm text-slate-600 line-clamp-2 mt-1">{campaignDescription}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
              <span>{progress}% funded</span>
              <span>{formatCurrency(raised)} raised</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleShare("facebook")}
          className="flex items-center justify-center space-x-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Facebook className="w-5 h-5" />
          <span className="font-medium">Facebook</span>
        </button>

        <button
          onClick={() => handleShare("twitter")}
          className="flex items-center justify-center space-x-3 p-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <Twitter className="w-5 h-5" />
          <span className="font-medium">Twitter</span>
        </button>

        <button
          onClick={() => handleShare("whatsapp")}
          className="flex items-center justify-center space-x-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">WhatsApp</span>
        </button>

        <button
          onClick={() => handleShare("email")}
          className="flex items-center justify-center space-x-3 p-4 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span className="font-medium">Email</span>
        </button>
      </div>

      {/* Copy Link */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">Campaign Link</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={campaignUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              copied ? "bg-green-100 text-green-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Sharing Tips */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-medium text-indigo-900 mb-2">💡 Sharing Tips</h4>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Share with your personal story to increase engagement</li>
          <li>• Post during peak hours (7-9 PM) for maximum reach</li>
          <li>• Use local hashtags like #SierraLeone #FreetwonCommunity</li>
          <li>• Tag friends who might be interested in supporting</li>
        </ul>
      </div>

      {/* Sharing Stats */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Campaign shared 47 times</span>
          <span>12 donations from social media</span>
        </div>
      </div>
    </div>
  )
}
