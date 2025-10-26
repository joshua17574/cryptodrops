import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
    );
}

/**
 * SECURITY: TLS Certificate Verification
 * 
 * NEVER disable TLS verification in production as it exposes you to MITM attacks.
 * Only allow disabling in development if explicitly needed via environment variable.
 * 
 * For Replit databases or Neon, TLS should work by default.
 * If you encounter SSL issues in development, set DISABLE_TLS_VERIFY=true in .env
 */
if (process.env.NODE_ENV === 'development' && process.env.DISABLE_TLS_VERIFY === 'true') {
  console.warn('⚠️  WARNING: TLS certificate verification is DISABLED. This is ONLY safe in development!');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Configure connection pool with secure defaults for standard PostgreSQL
export const client = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(client, { schema });
