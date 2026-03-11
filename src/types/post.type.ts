export interface IPost {
  id: string;
  userId: string;
  content: string;
  images: string[];
  createdAt: string;
  // For comments - if null, it's a root post. If has value, it's a comment/reply
  parentId: string | null;
  // Reference to the root post (for nested replies)
  rootId: string | null;
  // Reference to original post (for comments)
  postId?: string;
  comments?: IPost[];
  // nested replies (for comments)
  replies?: IPost[];
  user: IUser;
  topic: string;
  likes?: ILike[];
  posts:IPost[]
}

export interface IRepost {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  post?: IPost;
  user?: IUser;
}

// IComment is now an alias for IPost (for backward compatibility)
export type IComment = IPost;

export interface ICommentForm {
  postId: string;
  userId: string;
  content: string;
  parentId?: string | null;
  rootId?: string | null;
}

export interface ILike {
  id: string;
  postId?: string;
  commentId?: string;
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
  name?: string;
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

