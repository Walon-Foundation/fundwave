import { z } from "zod"

export const registerSchema = z.object({
    firstName:z.string().min(1,"firstName is required"),
    lastName: z.string().min(1, "lastName is required"),
    email:z.string().email("email is required"),
    phone:z.string().min(1, "phone is required"),
    password:z.string().min(8, "password is required"),
})

export const loginSchema = z.object({
    email:z.string().email("email is required"),
    password:z.string().min(8, "password is required"),
})