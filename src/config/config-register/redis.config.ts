import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST_DEV || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
}));
