import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  groqApiKey: process.env.GROQ_API_KEY,
}));
