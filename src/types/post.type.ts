export interface IPost {
  id: string;
  userId: string;
  content: string;
  images: string;
  createdAt: string;
}

export type IPostForm = Pick<IPost, "content">;
