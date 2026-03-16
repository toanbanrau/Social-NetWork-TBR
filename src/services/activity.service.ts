import { axiosIntance } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import type { IPost, ILike, IFollow, IRepost, IUser } from "@/types/post.type";

export interface IActivity {
  id: string;
  type: "like" | "comment" | "follow" | "repost";
  createdAt: string;
  user?: IUser;
  post?: IPost;
}

// Fetch likes on all posts belonging to the current user
const getLikeActivities = async (userId: string): Promise<IActivity[]> => {
  // Get the user's posts first
  const { data: posts } = await axiosIntance.get(`/posts?userId=${userId}&parentId=`);
  if (!posts || posts.length === 0) return [];

  const likePromises = posts.map(async (post: IPost) => {
    const { data: likes } = await axiosIntance.get(
      `/likes?postId=${post.id}&userId_ne=${userId}`
    );
    const hydrated = await Promise.all(
      (likes ?? []).map(async (like: ILike) => {
        const { data: userArr } = await axiosIntance.get(`/users?id=${like.userId}`);
        return {
          id: `like-${like.id}`,
          type: "like" as const,
          createdAt: (like as any).createdAt || new Date().toISOString(),
          user: userArr?.[0],
          post,
        };
      })
    );
    return hydrated;
  });

  const results = await Promise.all(likePromises);
  return results.flat();
};

// Fetch comments on the current user's posts
const getCommentActivities = async (userId: string): Promise<IActivity[]> => {
  const { data: posts } = await axiosIntance.get(`/posts?userId=${userId}&parentId=`);
  if (!posts || posts.length === 0) return [];

  const commentPromises = posts.map(async (post: IPost) => {
    const { data: comments } = await axiosIntance.get(
      `/posts?rootId=${post.id}&userId_ne=${userId}&parentId=${post.id}&_expand=user`
    );
    return (comments ?? []).map((comment: IPost) => ({
      id: `comment-${comment.id}`,
      type: "comment" as const,
      createdAt: comment.createdAt,
      user: comment.user,
      post,
    }));
  });

  const results = await Promise.all(commentPromises);
  return results.flat();
};

// Fetch new followers
const getFollowActivities = async (userId: string): Promise<IActivity[]> => {
  const { data: followers } = await axiosIntance.get(
    `/followers?followingId=${userId}`
  );

  const hydrated = await Promise.all(
    (followers ?? []).map(async (f: IFollow) => {
      const { data: userArr } = await axiosIntance.get(`/users?id=${f.followerId}`);
      return {
        id: `follow-${f.id}`,
        type: "follow" as const,
        createdAt: f.createdAt || new Date().toISOString(),
        user: userArr?.[0],
      };
    })
  );

  return hydrated;
};

// Fetch reposts of current user's posts
const getRepostActivities = async (userId: string): Promise<IActivity[]> => {
  const { data: posts } = await axiosIntance.get(`/posts?userId=${userId}&parentId=`);
  if (!posts || posts.length === 0) return [];

  const repostPromises = posts.map(async (post: IPost) => {
    const { data: reposts } = await axiosIntance.get(
      `/reposts?postId=${post.id}&userId_ne=${userId}&_expand=user`
    );
    return (reposts ?? []).map((repost: IRepost & { user?: IUser }) => ({
      id: `repost-${repost.id}`,
      type: "repost" as const,
      createdAt: repost.createdAt,
      user: repost.user,
      post,
    }));
  });

  const results = await Promise.all(repostPromises);
  return results.flat();
};

export const getActivities = async (userId: string): Promise<IActivity[]> => {
  const [likes, comments, follows, reposts] = await Promise.all([
    getLikeActivities(userId),
    getCommentActivities(userId),
    getFollowActivities(userId),
    getRepostActivities(userId),
  ]);

  const all = [...likes, ...comments, ...follows, ...reposts];
  // Sort by most recent first
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all;
};

export const useGetActivities = (userId: string) => {
  return useQuery({
    queryKey: ["activities", userId],
    queryFn: () => getActivities(userId),
    enabled: Boolean(userId),
  });
};
