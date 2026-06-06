import { registerAs } from '@nestjs/config';

export default registerAs('adzuna', () => ({
  appId: process.env.ADZUNA_APP_ID,
  appKey: process.env.ADZUNA_APP_KEY,
}));
