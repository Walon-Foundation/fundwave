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
    fullStory: string;
    tags: string[];
    status: "active" | "pending" | "rejected" | "completed";
    createdAt: Date;
    updatedAt: Date;
}


export interface CreateCampaign {
    title:string
    description:string
    fullDescription:string
    location:string
    endDate:Date
    targetAmount: number
    tag:string[]
    campaignType:string
    category:string
    teamMembers:string[]
    image:File
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
    amount:string
    name:string
    email:string
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
    }[];
}


export interface UserProfile {
    name: string;
    email: string;
    totalDonated: number;
    createdAt: Date;
    phone: string | null;
    profile_pic: string | null;
    isVerified: boolean;
    campaignCreated: {
        campaignCreated: number;
    };
    totalRaised: {
        totalRaised: string | null;
    };
    campaignSupported: {
        campaignSupported: number;
    };
}


export interface UserKYC {
    address:string
    district:string
    documentType:string
    documentNumber:string
    occupation:string
    nationality:string
    age:number
    phoneNumber:string
    profilePicture:File
    documentPhoto:File
}


export interface Donation {
    totalDonated: number;
    paymentDate: Date | undefined;
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
    fullStory: string;
    tags: string[];
    status: "active" | "pending" | "rejected" | "completed";
    createdAt: Date;
    updatedAt: Date;
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
        fullStory: string;
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
    teamMembers: {
        id:string
        role:string,
        name:string,
        bio:string,
        campaignId:string
    }[];
    recentDonors: {
        name:string | null,
        amount: number
    }[];
}


