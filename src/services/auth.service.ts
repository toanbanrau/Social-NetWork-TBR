import type { ILogin, IRegister, IUser } from "@/types/user.type";
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