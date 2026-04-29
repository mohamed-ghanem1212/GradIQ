import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackurl: process.env.GOOGLE_CALLBACK_URL,
}));
