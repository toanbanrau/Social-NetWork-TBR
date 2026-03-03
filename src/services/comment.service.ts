import { useQuery } from "@tanstack/react-query";
import { axiosIntance } from "../utils/api";
import type { IComment } from "@/types/post.type";

// Helper function to build nested comment tree
const buildNestedComments = (comments: IComment[]): IComment[] => {
  const commentMap = new Map<string, IComment>();
  const rootComments: IComment[] = [];

  // First pass: create a map of all comments
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build hierarchy
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parentId) {
      const parentComment = commentMap.get(comment.parentId);
      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
};

export const getCommentsByPostId = async (
  postId: string
): Promise<IComment[]> => {
  const { data } = await axiosIntance.get(
    `/comments?postId=${postId}&_expand=user&_embed=likes`
  );
  const allComments = data ?? [];
  // Build nested structure and return only root comments
  return buildNestedComments(allComments);
};

export const useGetCommentsByPostId = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId,
  });
};

export const likeComment = (commentId: string, userId: string) => {
  return axiosIntance.post("/likes", {
    commentId,
    userId,
  });
};

export const deleteLikeComment = (likeId: string) => {
  return axiosIntance.delete(`/likes/${likeId}`);
};

export const getCommentLikeByUser = (
  commentId: string,
  userId: string
) => {
  return axiosIntance.get(
    `/likes?commentId=${commentId}&userId=${userId}`
  );
};