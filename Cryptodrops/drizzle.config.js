
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/schema.js',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    // Remove SSL for local PostgreSQL
  }
});