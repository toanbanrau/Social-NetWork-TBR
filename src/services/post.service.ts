import type { IPost, IPostForm, ICommentForm, IRepost } from "@/types/post.type";
import { axiosIntance } from "../utils/api";
import { useQuery } from "@tanstack/react-query";

// Helper function to build nested post/comment tree
const buildNestedPosts = (posts: IPost[]): IPost[] => {
  const postMap = new Map<string, IPost>();
  const rootPosts: IPost[] = [];

  // First pass: create a map of all posts
  posts.forEach((post) => {
    postMap.set(post.id, { ...post, replies: [] });
  });

  // Second pass: build hierarchy
  posts.forEach((post) => {
    const postWithReplies = postMap.get(post.id)!;
    if (post.parentId) {
      const parentPost = postMap.get(post.parentId);
      if (parentPost) {
        if (!parentPost.replies) parentPost.replies = [];
        parentPost.replies.push(postWithReplies);
      }
    } else {
      rootPosts.push(postWithReplies);
    }
  });

  return rootPosts;
};

// Get only root posts (not comments)
export const getPosts = async (): Promise<IPost[]> => {
  const { data } = await axiosIntance.get("/posts?parentId=&_expand=user&_embed=likes&_embed=posts");
  // Add parentId=null to posts that don't have it
  const postsWithParentId = (data ?? []).map((post: IPost) => ({
    ...post,
    parentId: post.parentId ?? null,
    rootId: post.rootId ?? null
  }));
  return postsWithParentId;
};

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};

export const getPostsByUserId = async (userId: string): Promise<IPost[]> => {
  const { data } = await axiosIntance.get(`/posts?userId=${userId}&parentId=&_expand=user&_embed=likes&_embed=posts`);
  return data ?? [];
}

export const useGetPostsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["posts", userId],
    queryFn: () => getPostsByUserId(userId),
  });
}

export const getPostById = async (id: string): Promise<IPost> => {
  const { data } = await axiosIntance.get(`/posts/${id}?_expand=user&_embed=likes&_embed=posts`);
  return data;
}
export const useGetPostById = (id: string) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id),
  });
}

export const creatPosts = async (formdata: IPostForm) => {
  const { data } = await axiosIntance.post("/posts", {
    ...formdata,
    parentId: null,
    rootId: null,
  });
  return data;
};

export const updatePost = async (id: string, formdata: IPostForm) => {
  const { data } = await axiosIntance.put(`/posts/${id}`, formdata);
  return data;
}

// Create a comment (which is actually a post with parentId)
export const createComment = async (formdata: ICommentForm) => {
  const { data } = await axiosIntance.post("/posts", {
    content: formdata.content,
    images: [],
    userId: formdata.userId,
    parentId: formdata.parentId || formdata.postId,
    rootId: formdata.rootId || formdata.postId,
    postId: formdata.postId,
  });
  return data;
}

// Get comments for a specific post (posts with parentId = postId)
export const getCommentsByPostId = async (postId: string): Promise<IPost[]> => {
  const { data } = await axiosIntance.get(
    `/posts?rootId=${postId}&_expand=user&_embed=likes&_sort=createdAt&_order=asc`
  );
  const allPosts = data ?? [];
  // Build nested structure and return only root comments
  return buildNestedPosts(allPosts);
};

export const useGetCommentsByPostId = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId,
  });
};

// Like a post (or comment)
export const postLike = async (postId: string, userId: string) => {
  const { data } = await axiosIntance.post("/likes", { postId, userId });
  return data;
}

// Like a post/comment
export const likePost = (postId: string, userId: string) => {
  return axiosIntance.post("/likes", {
    postId,
    userId,
  });
};

export const deleteLike = async (likeId: string) => {
  const { data } = await axiosIntance.delete(`/likes/${likeId}`);
  return data;
};

// Delete like for a post/comment
export const deleteLikePost = (likeId: string) => {
  return axiosIntance.delete(`/likes/${likeId}`);
};

// Get likes for a specific post/comment
export const getLikesByPostId = (postId: string) => {
  return axiosIntance.get(`/likes?postId=${postId}`);
};

// Get like by user for a specific post/comment
export const getPostLikeByUser = (postId: string, userId: string) => {
  return axiosIntance.get(`/likes?postId=${postId}&userId=${userId}`);
};

// Get replies by user
export const getRepliesByUserId = async (userId: string): Promise<IPost[]> => {
  const { data } = await axiosIntance.get(
    `/posts?userId=${userId}&parentId_ne=null&_expand=user&_embed=likes`
  );
  return data ?? [];
};

export const useGetRepliesByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["replies", userId],
    queryFn: () => getRepliesByUserId(userId),
    enabled: !!userId,
  });
};

export const getRepostsByUserId = async (userId: string): Promise<IRepost[]> => {
  // Fetch the basic repost entities first
  const { data } = await axiosIntance.get(`/reposts?userId=${userId}`);
  const reposts: IRepost[] = data ?? [];

  // For each repost, we fetch the fully hydrated post (with user, likes, etc.)
  // since JSON Server cannot do nested `_expand=post.user` easily
  const hydratedReposts = await Promise.all(
    reposts.map(async (repost) => {
      try {
        const fullPost = await getPostById(repost.postId);
        return { ...repost, post: fullPost };
      } catch (error) {
        return repost; // fallback
      }
    })
  );

  return hydratedReposts;
};

export const useGetRepostsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["reposts", userId],
    queryFn: () => getRepostsByUserId(userId),
    enabled: !!userId,
  });
};

export const createRepost = async (postId: string, userId: string): Promise<IRepost> => {
  const { data } = await axiosIntance.post("/reposts", {
    postId,
    userId,
    createdAt: new Date().toISOString()
  });
  return data;
};

export const deleteRepost = async (repostId: string) => {
  const { data } = await axiosIntance.delete(`/reposts/${repostId}`);
  return data;
};

// Get repost by user for a specific post
export const getRepostByUserAndPost = async (postId: string, userId: string): Promise<IRepost[]> => {
  const { data } = await axiosIntance.get(`/reposts?postId=${postId}&userId=${userId}`);
  return data ?? [];
};

export const useGetRepostByUserAndPost = (postId: string, userId: string) => {
  return useQuery({
    queryKey: ["repostByUser", postId, userId],
    queryFn: () => getRepostByUserAndPost(postId, userId),
    enabled: !!postId && !!userId,
  });
};

