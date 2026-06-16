export type UserRole = "Admin";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  authProvider?: "credentials" | "google";
  supabaseUserId?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
