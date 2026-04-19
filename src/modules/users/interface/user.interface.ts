export interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  pfp: string;
  role: Role;
  accountType: AccountType;
  position: string;
  college: string;
  phone: string;
  address: string;
}

export type Role = 'USER' | 'ADMIN';
export type AccountType = 'EMPLOYER' | 'JOB_SEEKER' | 'FRESHER';
