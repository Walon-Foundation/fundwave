import { z } from "zod"

export const loginSchema = z.object({
    username: z.string().min(2,"Username must be at least 2 characters"),
    password: z.string().min(2,"Password must be at least 2 characters"),
})

export const registerSchema = z.object({
    firstName: z.string().min(2,"Firstname must be at least 2 characters"),
    lastName: z.string().min(2,"Lastname must be at least 2 characters"),
    username: z.string().min(2,"Username must be at least 2 characters"),
    password: z.string().min(2,"Password must be at least 2 characters"),
    email: z.string().email().min(2,"Email must be at least 2 characters"),
   
})