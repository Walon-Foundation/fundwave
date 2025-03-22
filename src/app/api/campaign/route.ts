import Campaign from "@/core/models/campaignModel";
import User from "@/core/models/userModel";
import { NextRequest } from "next/server";
import { ConnectDB } from "@/core/configs/mongoDB";
import jwt from "jsonwebtoken";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { campaignCreateSchema } from "@/core/validators/campaign.schema";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    //connecting to the database
    await ConnectDB();

    //getting the accessToken from the cookies
    const token =  (await cookies()).get("accessToken")?.value as string | undefined
    console.log(token)
    if(!token){
      return errorHandler(401, "unauthorized", null)
    }
    
    //verifing the cookie
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! as string) as {id:string, username:string, iscampaign:boolean};

    const decodedUser = decodedToken;

    if(decodedUser.iscampaign != true){
      return errorHandler(401, "User kyc needed", "not eligible to create a campaign")
    }

    //getting data from the request body
    const reqBody = await req.json()
    const result = campaignCreateSchema.safeParse(reqBody)
    if(!result.success){
      return errorHandler(400,result.error.issues[0].message,null)
    }
    
    const {
      campaignDescription,
      campaignName,
      amountNeeded,
      completionDate,
      risksAndChallenges,
      milestoneTitle,
      category,
      teamInformation,
      expectedImpact,
    } = result.data;

    //checking if the decodedUser is correct
    const user = await User.findOne({ _id:decodedUser.id });
    if (!user) {
        return errorHandler(401,"User not found",null)
    }

    //checking if a campaign exist with that name
    const campaign = await Campaign.findOne({campaignName})
    if(campaign){
        return errorHandler(400,"Campaign already exist",null)
    }

    //creating the new campaign
    const newCampaign = await new Campaign({
      campaignDescription,
      campaignName,
      amountNeeded,
      completionDate,
      risksAndChallenges,
      milestoneTitle,
      category,
      teamInformation,
      expectedImpact,
      creatorName: user.username,
      creatorId: user._id,
    });

    // Add campaign to user's campaigns
    user.campaigns.push(campaign._id);
    await user.save();


    //saving campaign to the database
    await newCampaign.save();

    return apiResponse("Campaign created successfully",200, newCampaign);
  } catch (error: unknown) {
    return errorHandler(500, "Internal Server Error", error);
  }
}

export async function GET() {
  try{
    const campaigns = await Campaign.find({})
    if(campaigns.length === 0){
      return apiResponse("No campaigns found",200, undefined)
    }
    return apiResponse("Campaigns found",200, campaigns)
  }catch(error){
    return errorHandler(500,"Internal server error",error)
  }
}
