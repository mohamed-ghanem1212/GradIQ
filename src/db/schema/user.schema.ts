import { relations } from 'drizzle-orm';
import { text } from 'drizzle-orm/pg-core';
import { pgTable, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { cv } from './cv.schema';
import { ats } from './ats.schema';
export const roleEnum = pgEnum('role_enum', ['USER', 'ADMIN']);
export const accountTypeEnum = pgEnum('account_type_enum', [
  'EMPLOYER',
  'JOB_SEEKER',
  'FRESHER',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  pfp: text('pfp')
    .default('https://cdn-icons-png.flaticon.com/512/149/149071.png')
    .notNull(),
  role: roleEnum('role').default('USER').notNull(),
  accountType: accountTypeEnum('account_type').default('FRESHER').notNull(),
  position: text('position').notNull(),
  college: text('college').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const usersRelations = relations(users, ({ many }) => ({
  cvs: many(cv),
  ats: many(ats),
}));
