import z from 'zod';
import { insertJobOfferSchema } from '../schema/jobOffer.schema';

export const validateJobOffer = insertJobOfferSchema.extend({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  descriptions: z
    .string()
    .min(10, 'Descriptions must be at least 10 characters long'),
  cv_id: z.uuid('Invalid CV ID'),
  user_id: z.uuid('Invalid User ID'),
});
