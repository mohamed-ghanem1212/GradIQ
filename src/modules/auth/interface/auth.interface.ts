import { User } from '@modules/users/interface/user.interface';

export type safeUser = Omit<User, 'password'>;
export interface AuthenticatedUser {
  user: safeUser;
  token: string;
}
