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
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackurl: process.env.GOOGLE_CALLBACK_URL as string,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  },
  redis: {
    host: process.env.REDIS_HOST_DEV || 'localhost',
    hostPROD: process.env.REDIS_HOST_PROD || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY as string,
  },
  adzuna: {
    appId: process.env.ADZUNA_APP_ID as string,
    appKey: process.env.ADZUNA_APP_KEY as string,
  },
} as const;
