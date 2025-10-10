export interface Campaign {
    id: string;
    title: string;
    fundingGoal: number;
    amountReceived: number;
    location: string;
    campaignEndDate: Date;
    creatorId: string;
    creatorName: string;
    category: string;
    image: string;
    shortDescription: string;
    tags: string[];
    status: "active" | "pending" | "rejected" | "completed";
    createdAt: Date;
    updatedAt: Date;
}


export interface Comments {
    id: string;
    message: string;
    username: string;
    campaignId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateComment {
    comment:string
}

export interface Updates {
    id: string;
    title: string;
    message: string;
    campaignId: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUpdate {
    title:string
    content:string
    image:File | null
}


export interface CreatePayment {
    phone:string
    amount:number
    name?:string
    email:string
    isAnonymous:boolean
}



export interface Dashboard {
    campaigns: {
        totalComments: number;
        totalDonors: number;
        id: string;
        name: string;
        status: "active" | "pending" | "rejected" | "completed";
        createdAt: Date;
        amountNeeded: number;
        donated: number;
        endDate: Date;
    }[];
    totalDonors: number;
    totalRaised: string | number;
    notifications: {
        id: string;
        title: string;
        campaignId: string;
        type: "comment" | "update" | "donations" | "campaignStuff";
        userId: string | null;
        createdAt: Date;
        read:boolean
    }[];
}


export interface ApiError {
    status:number,
    message:string,
    details?:any
}


export interface CampaignDetails {
    campaign: {
        id: string;
        title: string;
        fundingGoal: number;
        amountReceived: number;
        location: string;
        campaignEndDate: Date;
        creatorId: string;
        creatorName: string;
        category: string;
        image: string;
        shortDescription: string;
        financialAccountId:string;
        tags: string[];
        status: "active" | "pending" | "rejected" | "completed";
        createdAt: Date;
        updatedAt: Date;
    };
    updates: {
        id: string;
        title: string;
        message: string;
        campaignId: string;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[];
    comments: {
        id: string;
        message: string;
        username: string;
        campaignId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    recentDonors: {
        name:string | null,
        amount: number
        time:Date
    }[];
    creator:{
        id:string,
        name:string,
        verified:boolean
        profilePicture:string,
        location:string,
        campaignsCreated:number,
        totalRaised:number
    }
}




export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phone?: string
  bio?: string
  location?: string
  profilePicture?: string
  joinDate: string
  isVerified: boolean
  totalDonated: number
  campaignsStarted: number
  donationsMade: number
  totalRaised: number
}

export interface UserCampaign {
  id: string
  title: string
  status: "active" | "completed" | "paused" | "cancelled"
  amountRaised: number
  targetAmount: number
  progress: number
  createdAt: string
  endDate?: string
}

export interface UserDonation {
  id: string
  campaignId: string
  campaignTitle: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  message?: string
}

export interface ProfileStats {
  campaignsStarted: number
  donationsMade: number
  totalRaised: number
  totalDonated: number
}

export interface CombinedUserData {
  profile: UserProfile;
  campaigns: UserCampaign[];
  donations: UserDonation[];
  stats: ProfileStats;
}



