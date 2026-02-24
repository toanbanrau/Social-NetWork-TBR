import { useQuery } from "@tanstack/react-query";
import { axiosIntance } from "../utils/api";
import type { IComment } from "@/types/post.type";

export const getCommentsByPostId = async (
  postId: string
): Promise<IComment[]> => {
  const { data } = await axiosIntance.get(
    `/comments?postId=${postId}&_expand=user&_sort=createdAt&_order=desc`
  );
  return data ?? [];
};

export const useGetCommentsByPostId = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId,
  });
};
