import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";
import Image from "next/image";
import { Campaign } from "@/core/types/types";
import { formatDate } from "@/core/helpers/formatDate";
import Link from "next/link";

export default function CampaignCard({ campaign }: {campaign: Campaign}) {
  return (
    <Card
      key={campaign._id}
      className="overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video w-full overflow-hidden">
        <Image
          src={campaign.campaignPicture || "/placeholder.svg"}
          alt={campaign.campaignName}
          width={300}
          height={200}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{campaign.campaignName}</CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Created {formatDate(campaign?.createdAt as string)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {campaign.campaignDescription}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>${campaign.moneyReceived} raised</span>
            <span className="font-medium">
              {Math.round(
                ((campaign?.moneyReceived ?? 0) / campaign.amountNeeded) * 100
              )}
              %
            </span>
          </div>
          <Progress
            value={((campaign?.moneyReceived ?? 0 ) / campaign.amountNeeded) * 100}
            className="h-2 bg-gray-200"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{campaign.backers} backers</span>
            <span>Goal: ${campaign.amountNeeded}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link className="w-full" href={`/campaign/${campaign._id}`}>
        <Button className="w-full bg-blue-500 hover:bg-blue-600">
          View Details
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
