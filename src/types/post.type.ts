export interface IPost {
  id: string;
  userId: string;
  content: string;
  images: string[];
  createdAt: string;
  comments?: IComment[];
  user:IUser
  topic:string;
  likes?: ILike[];
}
export interface IComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  images:string[]
  parentId?: string | null;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export interface ICommentForm {
  postId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}

export interface ILike {
  id: string;
  postId: string;
  userId: string; 
}

export interface IFollow {
  id: string;
  followerId: string;
  followingId: string;  
  createdAt: string;
}

export interface IUser {
  id: string;
  username: string;
  avatar: string;
  email: string;
  password: string;
  bio: string;
  followers:IFollow[]
}

export type IRegister = Pick<IUser, "email" | "password" | "username">;
export type ILogin = Pick<IUser, "email" | "password">;

export type IPostForm = Pick<IPost, "content" | "images" | "topic">;
