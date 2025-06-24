import { z } from "zod"

export const addCommentSchema = z.object({
    description: z.string().min(2, "Description must be at least 2 characters")
})