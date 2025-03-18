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

export const updateUserSchema = z.object({
    country: z.string().min(2, "Country must be at least to 2 characters long"),
    sex: z.enum(["Male", "Female"]),
    phoneNumber: z.number().min(9, "Number must have at least 9 digits "),
    capitalCity: z.string().min(2, "Capital city must be at least 2 characters"),
    qualificaton:z.string().min(2, "Qualification must be at least 2 characters"),
    DOB: z.string().min(2, "DOB must be at least 2 characters")
})

export const forgotPasswordSchema = z.object({
    username:z.string().min(2, "Username must be at least 2 character"),
    password: z.string().min(2, "Password must be at least 2 characters")
})