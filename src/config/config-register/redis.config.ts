import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST_DEV || 'localhost',
  hostPROD: process.env.REDIS_HOST_PROD || 'redis',
  port: parseInt(process.env.REDIS_PORT) || 6379,
}));
