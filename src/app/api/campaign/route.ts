import Campaign from "@/core/models/campaignModel";
import User from "@/core/models/userModel";
import { NextRequest } from "next/server";
import { ConnectDB } from "@/core/configs/mongoDB";
import jwt from "jsonwebtoken";
import { apiResponse } from "@/core/helpers/apiResponse";
import { errorHandler } from "@/core/helpers/errorHandler";
import { campaignCreateSchema } from "@/core/validators/campaign.schema";
import { cookies } from "next/headers";
import { supabase } from "@/core/configs/supabase";

export async function POST(req: NextRequest) {
  try {
    //connecting to the database
    await ConnectDB();

    //getting the accessToken from the cookies
    const token =  (await cookies()).get("accessToken")?.value as string | undefined
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
    const formData = await req.formData()

    const campaignName = formData.get("campaignName") as string
    const campaignDescription = formData.get("campaignDescription") as string
    const amountNeeded = formData.get("amountNeeded") as string
    const milestone = formData.get("milestone") as string
    const teamInformation = formData.get("teamInformation") as string
    const problem = formData.get("problem") as string
    const solution = formData.get("solution") as string
    const risksAndChallenges = formData.get("risksAndChallenges") as string
    const expectedImpact = formData.get("expectedImpact") as string
    const category = formData.get("category") as string
    const completionDate = formData.get("completionDate") as string
    const campaignPicture = formData.get("campaignPicture") as File 

    const reqBody = {
      campaignDescription,
      campaignName,
      amountNeeded,
      completionDate,
      risksAndChallenges,
      milestone,
      category,
      teamInformation,
      expectedImpact,
      problem,
      solution:JSON.parse(solution)
    };

    if(!campaignPicture){
      return errorHandler(404, "no campaign picture found", "invalid campaign picture")
    }

    const result = campaignCreateSchema.safeParse(reqBody)
    if(!result.success){
      return errorHandler(400,result.error.issues[0].message,result.error)
    }
    
    //checking if the decodedUser is correct
    const user = await User.findOne({ _id:decodedUser.id });
    if (!user) {
      return errorHandler(401,"User not found",null)
    }

    //checking if a campaign exist with that name
    const campaign = await Campaign.findOne({campaignName})
    if(campaign){
      return errorHandler(400,"Campaign already exist","campaign already exist")
    }

    //converting file to buffer for supabase upload
    const buffer = await campaignPicture.arrayBuffer();
    const bytes = Buffer.from(buffer);

    //sending to supabase
    const filename = `${campaignPicture.name} - ${Date.now()} - ${campaignName}`

    const { error } = await supabase.storage.from("campaigns").upload(
      filename, bytes, {
        cacheControl: '3600',
        upsert: false,
        contentType: campaignPicture.type, // Use the file's MIME type
      }
    )
    if(error){
      return errorHandler(500, "failed to upload to supabase", error.message)
    }

    const { data:urlData} = supabase.storage.from("campaigns").getPublicUrl(filename)
    const campaignPictureUrl = urlData.publicUrl



    //creating the new campaign
    const newCampaign = await new Campaign({
      campaignPicture:campaignPictureUrl,
      campaignDescription,
      campaignName,
      amountNeeded: Number(amountNeeded),
      completionDate,
      risksAndChallenges,
      milestone,
      category,
      teamInformation,
      expectedImpact,
      creatorName: user.username,
      creatorId: user._id,
      problem,
      solution:JSON.parse(solution)
    });

    //saving campaign to the database
    await newCampaign.save();


    // Add campaign to user's campaigns
    user.campaigns.push(newCampaign._id);
    await user.save();

    return apiResponse("Campaign created successfully",201, newCampaign);
  } catch (error: unknown) {
    return errorHandler(500, "Internal Server Error", error);
  }
}

export async function GET() {
  try{
    //database connection
    await ConnectDB()
    
    const campaigns = await Campaign.find({})
    if(campaigns.length === 0){
      return apiResponse("No campaigns found",200, undefined)
    }
    return apiResponse("Campaigns found",200, campaigns)
  }catch(error){
    return errorHandler(500,"Internal server error",error)
  }
}
