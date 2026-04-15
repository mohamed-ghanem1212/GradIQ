import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env file');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/**/*.ts',
  out: './src/db/drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  verbose: true,
  breakpoints: true,
  migrations: {
    table: '__drizzle_migrations',
    schema: 'drizzle',
  },
});
