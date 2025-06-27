import { z } from "zod"

export const createComment = z.object({
    comment:z.string().min(2, "comment is required"),
})