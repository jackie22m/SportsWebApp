export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
  role: string;
  status: string;
  emailVerified: boolean;
};
