import { z } from "zod"

export const createCode = z.object({
    phone:z.string().min(1,"phone is required"),
    amount:z.number().min(1,"amount is required"),
    name:z.string().min(1,"name is required").optional(),
    email:z.string().email(),
    isAnonymous:z.boolean()
})