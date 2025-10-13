import { z } from "zod";

const EnvSchema = z.object({
  // Core app env
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),

  // Database (optional here; you seem to use Drizzle with configured clients)
  DATABASE_URL_PROD: z.string().url().optional(),
  DATABASE_URL_DEV: z.string().url().optional(),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().min(1).optional(),

  // Webhooks/Secrets
  WEBHOOK_SECRET: z.string().min(1).optional(),
  // MONIME_WEBHOOK_SECRET intentionally optional; add if used

  // Public API base (optional fallback is handled in code)
  NEXT_PUBLIC_API_URL: z.string().optional(),

  // Monime
  MONIME_SPACE_ID: z.string().min(1),
  MONIME_ACCESS_TOKEN: z.string().min(1),
  MONIME_MAIN_ACCOUNT_ID_PROD: z.string().min(1).optional(),

  // Email
  GOOGLE_SMTP_EMAIL: z.string().email().optional(),
  GOOGLE_SMTP_PASSWORD: z.string().min(1).optional(),

  // Admin
  ADMIN_CLERK_ID: z.string().min(1).optional(),
  ADMIN_HOST: z.string().min(1).optional(),
  DEV_ADMIN_HOST: z.string().min(1).optional(),

  // Misc
  PING_URL: z.string().url().optional(),
  // OPENAI_API_KEY: z.string().min(1).optional(),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL_PROD: process.env.DATABASE_URL_PROD,
  DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,

  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,

  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,

  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,

  MONIME_SPACE_ID: process.env.MONIME_SPACE_ID,
  MONIME_ACCESS_TOKEN: process.env.MONIME_ACCESS_TOKEN,
  MONIME_MAIN_ACCOUNT_ID_PROD: process.env.MONIME_MAIN_ACCOUNT_ID_PROD,

  GOOGLE_SMTP_EMAIL: process.env.GOOGLE_SMTP_EMAIL,
  GOOGLE_SMTP_PASSWORD: process.env.GOOGLE_SMTP_PASSWORD,

  ADMIN_CLERK_ID: process.env.ADMIN_CLERK_ID,
  ADMIN_HOST: process.env.ADMIN_HOST,
  DEV_ADMIN_HOST: process.env.DEV_ADMIN_HOST,

  PING_URL: process.env.PING_URL,
  // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});
