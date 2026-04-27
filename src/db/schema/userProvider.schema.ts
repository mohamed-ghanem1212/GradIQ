import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  pgEnum,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const providerEnum = pgEnum('provider', ['github', 'google']);

export const userAccounts = pgTable(
  'user_accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: providerEnum('provider').notNull(),
    providerAccountId: varchar('provider_account_id', {
      length: 255,
    }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    lastLoginAt: timestamp('last_login_at').notNull().defaultNow(),
  },
  (table) => [unique().on(table.provider, table.providerAccountId)],
);

export const userAccountsRelations = relations(userAccounts, ({ one }) => ({
  user: one(users, {
    fields: [userAccounts.userId],
    references: [users.id],
  }),
}));
