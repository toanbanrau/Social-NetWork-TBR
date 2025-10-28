import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const URL_UPLOAD =
  import.meta.env.VITE_API_URL_UPLOAD ||
  "https://api.cloudinary.com/v1_1/dydx9nixm/upload";
export const axiosIntance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosUpload = axios.create({
  baseURL: URL_UPLOAD,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosIntance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
