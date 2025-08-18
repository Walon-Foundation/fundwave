import { z } from "zod"

export const kycSchema = z.object({
    address:z.string().min(2,"address is required"),
    district:z.string().min(2, "district is required"),
    documentType:z.string().min(2, "documentType is required"),
    documentNumber:z.string().min(2, "documentNumber is required"),
    occupation:z.string().min(2, "occupation is required"),
    nationality:z.string().min(2, "nationality is required"),
    age:z.number().min(2, "age is required"),
    phoneNumber:z.string().min(9, "phone number is required"),
    bio:z.string().min(2, "bio is required")
})
