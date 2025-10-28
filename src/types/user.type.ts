export interface IUser {
  id: string;
  username: string;
  avatar: string;
  email: string;
  password: string;
  bio: string;
}

export type IAuth = Pick<IUser, "email" | "password">;