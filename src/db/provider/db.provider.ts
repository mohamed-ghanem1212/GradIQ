import { sql } from 'drizzle-orm';
import db from '../connector';

export const DB_PROVIDER = Symbol('POSTGRES_CONNECTION');

export const dbProvider = {
  provide: DB_PROVIDER,
  useFactory: async () => {
    await db.execute(sql`SELECT 1`);
    return db;
  },
};
