import { text, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { ats } from './ats.schema';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';
import { createInsertSchema } from 'drizzle-zod';

export const jobOffers = pgTable('job_offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  descriptions: text('descriptions').notNull(),
  ats_id: uuid('ats_id')
    .notNull()
    .references(() => ats.id),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id),
});

export const jobOfferRelations = relations(jobOffers, ({ one }) => ({
  users: one(users, {
    references: [users.id],
    fields: [jobOffers.user_id],
  }),
  ats: one(ats, {
    references: [ats.id],
    fields: [jobOffers.ats_id],
  }),
}));

export const insertJobOfferSchema = createInsertSchema(jobOffers);
