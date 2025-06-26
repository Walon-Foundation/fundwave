import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './db/drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NODE_ENV === "development" ? process.env.DATABASE_URL_DEV! : process.env.DATABASE_URL_PROD!,
  },
});
