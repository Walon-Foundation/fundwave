import { z } from "zod"

export const campaignCreateSchema = z.object({
    campaignName: z.string().min(2,"Campaign name must be at least 2 characters"),
    campaignDescription: z.string().min(2,"Campaign description must be at least 2 characters"),
    category: z.string().min(2,"Category must be at least 2 characters"),
    milestone: z.string().min(2,"Milestone title must be at least 2 characters"),
    amountNeeded: z.number().min(2,"Amount needed must be at least 2 characters"),
    completionDate: z.string().min(2, "Completion date must be at least 2 characters"),
    teamInformation: z.string().min(2,"Team information must be at least 2 characters"),
    expectedImpact: z.string().min(2,"Expected impact must be at least 2 characters"),
    risksAndChallenges: z.string().min(2,"Risks and challenges must be at least 2 characters"),
    problem: z.string().min(2,"Problem must be at least 2 characters"),
    solution: z.string().min(2,"Solution must be at least 2 characters"),

})