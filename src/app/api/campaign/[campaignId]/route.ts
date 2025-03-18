import { NextResponse,NextRequest } from "next/server";
import Campaign from "@/core/models/campaignModel";
import { ConnectDB } from "@/core/configs/mongoDB";

export async function GET(req:NextRequest,{params}:{params:{campaignId:string}}){
    try{
        //connecting to the database
        await ConnectDB()

        //getting campaignId from the request url
        const { campaignId } = params

        //getting the campaign based on the given Id
        const campaign = await Campaign.findOne({_id:campaignId})
        if(!campaign){
            return NextResponse.json(
                {message:"Invalid  campaignId"},
                {status:400}
            )
        };

        //sending the campaign to the user
        return NextResponse.json(
            {campaign},
            {status:200}
        );

    }catch(error:unknown){
        return NextResponse.json(
            {message:"Internal Server Error",error},
            {status:500}
        )
    }
};



export async function DELETE(req:NextRequest,{params}:{params:{campaignId:string}}){
    try{
        //connecting to database
        await ConnectDB()

        //gettiing params from the url
        const { campaignId} = params

        //getting and deleting the campaign based on the given Id
        const campaign = await Campaign.findByIdAndUpdate({_id:campaignId})
        if(!campaign){
            return NextResponse.json(
                {message: "Invalid campaignId"},
                {status: 401}
            )
        };

        return NextResponse.json(
            {message:"Campaign deleted"},
            {status: 204}
        )

    }catch(error){
        return NextResponse.json(
            {message:"Internal server error",error},
            {status:500}
        )
    }
}