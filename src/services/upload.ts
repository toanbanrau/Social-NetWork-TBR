import { axiosUpload } from "../utils/api";

type resUpload = {
  url: string;
  secure_url: string;
};

export const upload = async (data: File) => {
  const formData = new FormData();
  formData.append("file", data);
  formData.append("upload_preset", "frontend_upload");
  try {
    const response = await axiosUpload.post<resUpload>("", formData, {});
    return response.data;
  } catch (error) {
    return { url: "", secure_url: "" };
    console.log(error);
  }
};
