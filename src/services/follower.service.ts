import { axiosIntance } from "@/utils/api";

export const postFollow = async (followerId: string, followingId: string) => {
  const { data } = await axiosIntance.post("/followers", { followerId, followingId });
  return data;
};

export const deleteFollow = async (followId: string) => {
  const { data } = await axiosIntance.delete(`/followers/${followId}`);
  return data;
};

export const checkFollow = async (followerId: string, followingId: string) => {
  const { data } = await axiosIntance.get(`/followers?followerId=${followerId}&followingId=${followingId}`);
  return data[0] ?? null;
};