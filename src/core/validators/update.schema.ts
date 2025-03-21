import { z } from "zod"

export const addUpdateSchema = z.object({
    title:z.string().min(2, "Title must be at least 2 characters long"),
    description:z.string().min(2, "Description must be at least two characters long")
})