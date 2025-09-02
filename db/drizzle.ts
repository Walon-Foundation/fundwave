import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from "./schema"

import ws from 'ws';
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const connectionString = process.env.NODE_ENV === "development"? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_PROD
if(!connectionString){
    throw new Error("no connection string found")
}

const sql = neon(connectionString);

export const db = drizzle(sql, {schema});
