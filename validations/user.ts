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

export const forgotPassword = z.object({
    email:z.string().min(1,"email is required")
})

export const resetPassword = z.object({
    email:z.string().min(2, "email is required"),
    password:z.string().min(2, "password is required")
})

export const kycSchema = z.object({
    address:z.string().min(2,"address is required"),
    district:z.string().min(2, "district is required"),
    documentType:z.string().min(2, "documentType is required"),
    documentNumber:z.string().min(2, "documentNumber is required"),
    occupation:z.string().min(2, "occupation is required"),
    nationality:z.string().min(2, "nationality is required"),
    age:z.number().min(2, "age is required"),
})
