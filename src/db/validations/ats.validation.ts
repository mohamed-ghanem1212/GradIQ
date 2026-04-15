import z from 'zod';
import { insertAtsSchema } from '../schema/ats.schema';

export const createAtsSchema = insertAtsSchema.extend({
  vulnerabilities: z
    .string()
    .min(10, 'Vulnerabilities must be at least 10 characters long'),
  suggestions: z
    .string()
    .min(10, 'Suggestions must be at least 10 characters long'),
  score: z.string().min(1, 'Score must be at least 1 character long'),
  cv_id: z.uuid('Invalid CV ID'),
});
