import { text, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { cv } from './cv.schema';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { numeric } from 'drizzle-orm/pg-core';

export const ats = pgTable('ats', {
  id: uuid('id').primaryKey().defaultRandom(),
  vulnerabilities: text('vulnerabilities').notNull(),
  suggestions: text('suggestions').notNull(),
  score: numeric('score').notNull().default('0'),
  cv_id: uuid('cv_id')
    .notNull()
    .references(() => cv.id),
});

export const atsRelations = relations(ats, ({ one }) => ({
  cv: one(cv, {
    references: [cv.id],
    fields: [ats.cv_id],
  }),
}));

export const insertAtsSchema = createInsertSchema(ats);
