import { z } from "zod"

const teamMember = z.object({
    name:z.string().min(2,"name is required"),
    bio:z.string().min(2,"bio is required"),
    role:z.string().min(2, "role is required")
})

export const createCampaign = z.object({
    title:z.string().min(1,"title is required"),
    shortDescription:z.string().min(5,"description is required"),
    location:z.string().min(2,"location is required"),
    endDate:z.date(),
    fundingGoal: z.number().min(2,"target amount is required"),
    tag:z.array(z.string().min(1)).optional().default([]),
    category:z.string().min(2, "category is required"),
})
