import type { IAuth } from "@/types/user.type";
import { axiosIntance } from "@/utils/api";

export const register = async (formResgiter: IAuth) => {
  const response = await axiosIntance.post("/login", formResgiter);
  return response.data;
};
