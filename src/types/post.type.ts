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
  images: string[];
  createdAt: string;
}

export interface IUser {
  id: string;
  username: string;
  avatar: string;
}

export interface ILike {
  id: string;
  postId: string;
  userId: string; 
}

export type IPostForm = Pick<IPost, "content" | "images" | "topic">;
