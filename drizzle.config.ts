import { defineConfig } from 'drizzle-kit';
import { config } from './config/config';

export default defineConfig({
  out: './db/drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.NODE_ENV === "dev" ? config.DATABASE_URL_DEV! : config.DATABASE_URL_PROD,
  },
});
