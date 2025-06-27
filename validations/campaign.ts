import { z } from "zod"

const teamMember = z.object({
    name:z.string().min(2,"name is required"),
    bio:z.string().min(2,"bio is required"),
    role:z.string().min(2, "role is required")
})

export const createCampaign = z.object({
    title:z.string().min(5,"title is required"),
    description:z.string().min(5,"description is required"),
    fullDescription:z.string().min(10, "full description is required"),
    location:z.string().min(2,"location is required"),
    endDate:z.date(),
    targetAmount: z.number().min(2,"target amount is required"),
    tag:z.array(z.string().min(2,"tag is required")),
    campaignType:z.string().min(2, "campaign type is required"),
    category:z.string().min(2, "category is required"),
    teamMembers:z.array(teamMember).optional()
})