import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { InternalServerErrorException } from '@nestjs/common';
export const DB_PROVIDER = Symbol('POSTGRES_CONNECTION');

export const dbProvider = [
  {
    provide: DB_PROVIDER,
    inject: [ConfigService],

    useFactory: async (configService: ConfigService) => {
      const connectionString = configService.get<string>('database.url');
      if (!connectionString) {
        throw new InternalServerErrorException(
          'Database connection string is not defined',
        );
      }

      const pool = new Pool({ connectionString });

      // verify connection at startup
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();

      return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
    },
  },
];
