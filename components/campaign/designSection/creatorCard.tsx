import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Campaign } from '@/core/types/types'
import { ExternalLink } from 'lucide-react'
import React from 'react'

export default function CreatorCard(
    {campaign}: {campaign: Campaign}
) {
  return (
    <Card className="border-blue-100 shadow-sm overflow-hidden">
    <div className="bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-3 border-b border-blue-100">
      <h3 className="text-lg font-semibold text-blue-800">Campaign Creator</h3>
    </div>
    <CardContent className="pt-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12 border-2 border-blue-100">
          <AvatarImage
            src={`https://avatar.vercel.sh/${campaign?.creatorName}`}
            alt={campaign.creatorName}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
            {campaign.creatorName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-blue-800">{campaign?.creatorName}</h4>
          <p className="text-sm text-gray-500">Campaign Organizer</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Visit Creator Profile
      </Button>
    </CardContent>
  </Card>
  )
}
