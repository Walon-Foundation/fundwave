import { z } from "zod";


export const withdrawSchema = z.object({
    phoneNumber: z.string().min(2, "Phone number is required")
})