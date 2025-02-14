import { NextResponse,NextRequest } from "next/server";
import Comment from "@/libs/models/commentModel";
import Campaign from "@/libs/models/campaignModel";
import { ConnectDB } from "@/libs/configs/mongoDB";

export async function POST(req:NextRequest,{params}:{params:{campaignId:string}}){
    try{
        //connect to the database
        await ConnectDB();

        //getting the params and  data from the request
        const { campaignId } = params
        const reqBody = await req.json()
        const { description } = reqBody

        //validating the data 
        if(!description || !campaignId){
            return NextResponse.json(
                {message:"All field required"},
                {status:500}
            )
        };

        //finding a campaign with the given ID
        const campaign = await Campaign.findById({_id:campaignId})
        if(!campaign){
            return NextResponse.json(
                {message:"Invalid campaignId"},
                {status: 401}
            )
        }

        //creating the comments
        const newComment = await new Comment({
            campaignId,
            description
        })

        campaign.comments.push(newComment._id)
        await campaign.save()

        await newComment.save()

        return NextResponse.json(
            {message:"comment successfull",newComment},
            {status: 201}
        )

    }catch(error:unknown){
        return NextResponse.json(
            {message:"Internal server error",error},
            {status: 500}
        )
    }
}

export async function GET(req:NextRequest,{params}:{params:{campaignId:string}}){
    try {
        // connect to database
        await ConnectDB();

        //get params from the url
        const { campaignId } = params
        
        //get the comments
        const comments = await Comment.find({campaignId})
        if(!comments){
            return NextResponse.json(
                {message:"Invalid campaignId"},
                {status: 401}
            )
        };

        //sending response to the user
        return NextResponse.json(
            {comments},
            {status: 200}
        )

    }catch(error:unknown){
        return NextResponse.json(
            {message:"Internal server error",error},
            {status: 500}
        )
    }
};