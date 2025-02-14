import Campaign from "@/libs/models/campaignModel";
import User from "@/libs/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import { ConnectDB } from "@/libs/configs/mongoDB";

export async function POST(req: NextRequest) {
  try {
    //connecting to the database
    await ConnectDB();

    //getting data from the request body
    const reqBody = await req.json()
    const {
      campaignDescription,
      campaignName,
      fundingGoal,
      amountNeeded,
      completionDate,
      risksAndChallenges,
      milestoneTitle,
      category,
      userId,
      teamInformation,
      expectedImpact,
    } = reqBody;

    if (
      !campaignDescription ||
      !campaignName ||
      !fundingGoal ||
      !amountNeeded ||
      !completionDate ||
      !risksAndChallenges ||
      !milestoneTitle ||
      !category ||
      !userId ||
      !teamInformation ||
      !expectedImpact
    ) {
      return NextResponse.json(
        { message: "All fields are required"},
        {status:400},
        )
    }

    //checking if the userId is correct
    const user = await User.findOne({ _id:userId });
    if (!user) {
        return NextResponse.json(
            {message:"Invalid userID"},
            {status:401}
        )
    }

    //checking if a campaign exist with that name
    const campaign = await Campaign.findOne({campaignName})
    if(campaign){
        return NextResponse.json(
            {message:"campaign already exist"},
            {status:401}
        )
    }

    //creating the new campaign
    const newCampaign = await new Campaign({
      campaignDescription,
      campaignName,
      fundingGoal,
      amountNeeded,
      completionDate,
      risksAndChallenges,
      milestoneTitle,
      category,
      teamInformation,
      expectedImpact,
      creator: user._id,
    });
    //saving campaign to the database
    await newCampaign.save();

    // Add campaign to user's campaigns
    user.campaigns.push(campaign._id);
    await user.save();

    return NextResponse.json(
        {message:"campiagn created",newCampaign},
        {status:201}
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal Server error", error },
      { status: 500 }
    );
  }
}
