import { z } from "zod"

const configSchema = z.object({
    DATABASE_URL_PROD: z.string().min(2, "DATABASE_URL_PROD is required"),
    DATABASE_URL_DEV: z.string().min(2, "DATABASE_URL_DEV is required").optional(),
    NODE_ENV: z.string().min(2, "NODE_ENV is required").default("dev"),
    JWT_SECRET:z.string().min(2, "JWT_SECRET is required"),
    GOOGLE_SMTP_PASSWORD:z.string().min(2, "GOOGLE_SMTP_PASSWORD is required"),
    GOOGLE_SMTP_EMAIL:z.string().min(2, "GOOGLE_SMTP_EMAIL is required")
})

function validateConfig(){
    const {success, error, data} = configSchema.safeParse({
        DATABASE_URL_PROD:process.env.DATABASE_URL_PROD,
        DATABASE_URL_DEV:process.env.DATABASE_URL_DEV,
        NODE_ENV:process.env.NODE_ENV,
        JWT_SECRET:process.env.JWT_SECRET,
        GOOGLE_SMTP_PASSWORD:process.env.GOOGLE_SMTP_PASSWORD,
        GOOGLE_SMTP_EMAIL:process.env.GOOGLE_SMTP_EMAIL,
    })
    if(!success){
        console.log(error.message)
        process.exit(1)
    }

    return data
}

export const config = validateConfig()