import { users } from '@db/schema/user.schema';
import { InferSelectModel } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum AccountType {
  EMPLOYER = 'EMPLOYER',
  JOB_SEEKER = 'JOB_SEEKER',
  FRESHER = 'FRESHER',
}
