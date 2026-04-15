import z from 'zod';
import { insertCvSchema } from '../schema/cv.schema';

export const createCvSchema = insertCvSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  summary: z.string().min(10, 'Summary must be at least 10 characters long'),
  note: z.string().min(10, 'Note must be at least 10 characters long'),
  user_id: z.uuid('Invalid User ID'),
  format: z.enum(['PDF', 'DOCX'], 'Invalid format, must be PDF or DOCX'),
});
