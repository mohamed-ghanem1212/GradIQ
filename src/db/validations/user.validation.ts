import { z } from 'zod';
import { insertUserSchema } from '../schema/user.schema';
export const createUserSchema = insertUserSchema.extend({
  email: z.email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
  pfp: z.url('Invalid URL').optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
  accountType: z.enum(['EMPLOYER', 'JOB_SEEKER', 'FRESHER']).default('FRESHER'),
  position: z.string().min(2, 'Position must be at least 2 characters long'),
  college: z.string().min(2, 'College must be at least 2 characters long'),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number'),
});
