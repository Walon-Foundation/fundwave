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
    category: {
      type: String,
      required: true
    },
    milestoneTitle: {
      type: String,
      required: true
    },
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
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    moneyRecieved: {
      type:Number,
      default: 0
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