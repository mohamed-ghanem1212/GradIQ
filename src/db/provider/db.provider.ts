import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
export const DB_PROVIDER = Symbol('POSTGRES_CONNECTION');

export const dbProvider = [
  {
    provide: DB_PROVIDER,
    inject: [ConfigService],

    useFactory: async (configService: ConfigService) => {
      const connectionString = configService.get<string>('database.url');
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in your .env file');
      }
      const pool = new Pool({
        connectionString,
      });

      return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
    },
  },
];
