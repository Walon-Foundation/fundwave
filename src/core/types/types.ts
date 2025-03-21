export interface Campaign {
  _id?: string;
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

export interface Comment {
  _id?: string;
  description: string;
  campaignId?: string | undefined;
  username?: string;
  userId?: string | undefined;
  reactions?: string[] | undefined[];
}

export interface Reaction {
  _id?: string;
  dislike: number;
  like: number;
  userId: string | undefined;
  username: string;
  commentId: string | undefined;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
  DOB: string;
  qualification?: string;
  campaigns?: string[];
  isCampaign: boolean;
  roles: string;
  address:string;
  createdAt:string,
  updatedAt:string,
}
