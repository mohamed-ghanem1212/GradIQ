// config/config.singleton.ts
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const config = {
  db: {
    url: process.env.DATABASE_URL as string,
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackurl: process.env.GITHUB_CALLBACK_URL as string,
  },
} as const;
