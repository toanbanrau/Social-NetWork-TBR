import type { IPost, IPostForm } from "@/types/post.type";
import { axiosIntance } from "../utils/api";
import { useQuery } from "@tanstack/react-query";

export const getPosts = async (): Promise<IPost[]> => {
  const { data } = await axiosIntance.get("/posts?_embed=comments&_expand=user&_embed=likes");
  return data ?? [];
};

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};

export const getPostsByUserId = async (userId: string): Promise<IPost[]> => {
  const { data } = await axiosIntance.get(`/posts?userId=${userId}&_embed=comments&_expand=user&_embed=likes`);
  return data ?? [];
}

export const useGetPostsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["posts", userId],
    queryFn: () => getPostsByUserId(userId),
  });
}

export const getPostById = async (id: string): Promise<IPost> => {
  const { data } = await axiosIntance.get(`/posts/${id}?_embed=comments&_expand=user&_embed=likes`);
  return data;
}
export const useGetPostById = (id: string) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id),
  });
}

export const creatPosts = async (formdata: IPostForm) => {
  const { data } = await axiosIntance.post("/posts", formdata);
  return data;
};

export const updatePost = async (id: string, formdata: IPostForm) => {
  const { data } = await axiosIntance.put(`/posts/${id}`, formdata);
  return data;
}

export const createComment = async (formdata: IPostForm) => {
  const { data } = await axiosIntance.post("/comments", formdata);
  return data;
}

export const postLike = async (postId: string, userId: string) => {
  const { data } = await axiosIntance.post("/likes", { postId, userId });
  return data;
} 

export const deleteLike = async (likeId: string) => {
  const { data } = await axiosIntance.delete(`/likes/${likeId}`);
  return data;
};
