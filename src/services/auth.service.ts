import type { ILogin, IRegister, IUser } from "@/types/post.type";
import { axiosIntance } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const register = async (formResgiter: IRegister) => {
  const response = await axiosIntance.post("/register", formResgiter);
  return response.data;
};

export const login = async (formLogin: ILogin) => {
  const response = await axiosIntance.post("/login", formLogin);
  return response.data;
}

export const searchUsers = async (query: string): Promise<IUser[]> => {
  const response = await axiosIntance.get(`/users?_embed=followers&username_like=${encodeURIComponent(query)}`);
  return response.data;
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    enabled: Boolean(query.trim()),
  });
};

export const getSuggestedUsers = async (currentUserId: string): Promise<IUser[]> => {
  const response = await axiosIntance.get(`/users?id_ne=${currentUserId}&_embed=followers`);
  return response.data;
};

export const useGetSuggestedUsers = (currentUserId: string) => {
  return useQuery({
    queryKey: ["users", "suggested", currentUserId],
    queryFn: () => getSuggestedUsers(currentUserId),
    enabled: Boolean(currentUserId),
  });
};

export const getInfor = async (username: string): Promise<IUser | null> => {
  const response = await axiosIntance.get(`/users?username=${encodeURIComponent(username)}`);
  const users: IUser[] = response.data;
  return users && users.length > 0 ? users[0] : null;
}

export const useGetInfor = (username: string) => {
  return useQuery({
    queryKey: ["users", username],
    queryFn: () => getInfor(username),
    enabled: Boolean(username),
  });
}

export const updateUser = async (id: string, data: Partial<IUser>): Promise<IUser> => {
  const response = await axiosIntance.patch(`/users/${id}`, data);
  return response.data;
}