import { z } from "zod"

export const createCode = z.object({
    phone:z.string().min(1,"phone is required"),
    amount:z.string().min(1,"amount is required"),
})