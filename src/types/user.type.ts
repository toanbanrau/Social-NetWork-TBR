export interface IUser {
  id: string;
  username: string;
  avatar: string;
  email: string;
  password: string;
  bio: string;
}

export type IRegister = Pick<IUser, "email" | "password" | "username">;
export type ILogin = Pick<IUser, "email" | "password">;