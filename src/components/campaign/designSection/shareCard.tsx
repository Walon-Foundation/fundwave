import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'

export default function ShareCard() {
  return (
    <Card className="border-blue-100 shadow-sm">
        <CardContent className="pt-4">
            <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 justify-between">
                Share on Facebook
                <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 justify-between">
                Share on Twitter
                <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 justify-between">
                Copy Link
                <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
            </div>
        </CardContent>
    </Card>
  )
}

