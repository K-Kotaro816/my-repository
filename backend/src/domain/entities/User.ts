export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithoutPassword = Omit<User, 'passwordHash'>;
