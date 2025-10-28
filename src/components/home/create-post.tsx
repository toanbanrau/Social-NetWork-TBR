import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import type { IPostForm } from "@/types/post.type";
import { upload } from "../../services/upload";
import { creatPosts } from "../../services/post.service";

const CreatPost = () => {
  const { register, handleSubmit } = useForm<IPostForm>();
  const [selectedImage, setSelectedImage] = useState<File | null>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = async (data: IPostForm) => {
    let image = "";
    if (selectedImage) {
      const uploaded = await upload(selectedImage);
      image = uploaded.secure_url;
    }
    const post = {
      content: data.content,
      images: image,
      createAt: new Date(),
    };
    creatPosts(post);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} action="">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={"/placeholder.svg"} />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                {...register("content")}
                placeholder="Bạn đang nghĩ gì?"
                className="min-h-20 resize-none border-0 p-0 focus-visible:ring-0"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleChooseImage}>
                    📷 Ảnh
                  </Button>
                  <Button variant="ghost" size="sm">
                    😊 Cảm xúc
                  </Button>
                </div>
                <Button type="submit">Đăng</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </form>
  );
};

export default CreatPost;
