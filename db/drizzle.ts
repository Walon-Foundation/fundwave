import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from "./schema"

import ws from 'ws';
import { config } from '../config/config';
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const sql = neon(config.NODE_ENV === "dev" ? config.DATABASE_URL_DEV! : config.DATABASE_URL_PROD);

export const db = drizzle(sql, {schema});
