import { z } from "zod";


export const withdrawSchema = z.object({
    phoneNumber: z.string().min(2, "Phone number is required"),
    amount:z.number().min(1, "amount is required"),
    provider:z.string().min(1, "proivder is required")
})