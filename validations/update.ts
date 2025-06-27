import { z } from "zod"

export const createUpdate = z.object({
    title:z.string().min(1,"title is required"),
    content:z.string().min(10, "content is required")
})