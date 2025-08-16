import { z } from "zod"

const teamMember = z.object({
    name:z.string().min(2,"name is required"),
    bio:z.string().min(2,"bio is required"),
    role:z.string().min(2, "role is required")
})

export const createCampaign = z.object({
    title:z.string().min(5,"title is required"),
    shortDescription:z.string().min(5,"description is required"),
    location:z.string().min(2,"location is required"),
    endDate:z.date(),
    fundingGoal: z.number().min(2,"target amount is required"),
    tag:z.array(z.string().min(1,"tag is required")),
    category:z.string().min(2, "category is required"),
    teamMembers:z.array(teamMember).optional(),
    problem:z.string().min(1, "problemStatement is required"),
    solution:z.string().min(2, "solution is required"),
    impact:z.string().min(1, "impact is required"),
    campaignType:z.enum(["business","project" ,"personal","community"]).default("personal")
})