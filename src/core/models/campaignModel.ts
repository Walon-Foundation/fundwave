import {models, model, Schema, Document} from "mongoose";

interface Campaign extends Document {
  campaignName: string;
  campaignDescription: string;
  category: string;
  milestoneTitle: string;
  amountNeeded: number;
  completionDate: string;
  teamInformation: string;
  expectedImpact: string;
  risksAndChallenges: string;
  creatorName: string;
  creatorId: string | undefined;
  moneyRecieved: number;
  comments: string[];
  problem:string,
  solution:string[]
  team:string,
  update:string[];
  backers:number
}

const campaignSchema = new Schema<Campaign>(
  {
    campaignName: {
      type: String,
      required: true
    },
    campaignDescription: {
      type: String,
      required: true
    },
    problem:{
      type:String,
      required:true
    },
    category: {
      type: String,
      required: true
    },
    solution:[{
      type:String,
      required:true
    }],
    milestoneTitle: {
      type: String,
      required: true
    },
    update:[{
      type:String
    }],
    amountNeeded: {
      type: Number,
      required: true
    },
    completionDate: {
      type: String,
      required: true
    },
    teamInformation: {
      type: String,
      required: true
    },
    expectedImpact: {
      type: String,
      required: true
    },
    risksAndChallenges: {
      type: String,
      required: true
    },
    creatorName: {
      type: String,
      required: true
    },
    team:{
      type:String
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    moneyRecieved: {
      type:Number,
      default: 0
    },
    backers:{
      type:Number,
      default:0
    },
    comments: [{
      type:Schema.Types.ObjectId,
      ref:"Comment",
    }]
  },
  {
    timestamps: true,
  }
);

const Campaign = models.campaigns || model('campaigns', campaignSchema);

export default Campaign;