import type { IPost, IPostForm } from "@/types/post.type";
import { axiosIntance } from "../utils/api";
import { useQuery } from "@tanstack/react-query";

export const getAllPost = async (): Promise<IPost[]> => {
  const { data } = await axiosIntance.get("/posts");
  return data ?? [];
};

export const usePostQuery = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPost,
  });
};

export const creatPosts = async (formdata: IPostForm) => {
  const { data } = await axiosIntance.post("/posts", formdata, {});
  return data;
};
