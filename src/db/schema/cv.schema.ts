import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ats } from './ats.schema';
import { createInsertSchema } from 'drizzle-zod';

export const formatEnum = pgEnum('format_enum', ['PDF', 'DOCX']);
export const cv = pgTable('cv', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  note: text('note').notNull(),
  format: formatEnum('format').default('PDF').notNull(),
});

export const cvRelations = relations(cv, ({ one, many }) => ({
  users: one(users, {
    references: [users.id],
    fields: [cv.user_id],
  }),
  ats: many(ats),
}));

export const insertCvSchema = createInsertSchema(cv);
