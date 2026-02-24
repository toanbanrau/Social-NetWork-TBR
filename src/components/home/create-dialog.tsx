import { Dialog, DialogContent } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import type { IPostForm } from "@/types/post.type";
import { upload } from "../../services/upload";
import { creatPosts } from "@/services/post.service";
import { CircleEllipsis, ImagePlus, SmilePlus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { atomAuth } from "@/stores/auth";
import { useAtom } from "jotai";

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const [auth] = useAtom(atomAuth);
  const { register, handleSubmit } = useForm<IPostForm>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const onSubmit = async (data: IPostForm) => {
    const images: string[] = [];
    for (const file of selectedImages) {
      const uploaded = await upload(file);
      images.push(uploaded.secure_url);
    }
    const post = {
      userId: auth?.user?.id,
      content: data.content,
      images: images,
      createdAt: new Date(),
      topic: data.topic,
    };
    creatPosts(post);
    onOpenChange(false);
    setSelectedImages([]);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl w-full">
        <div className="flex justify-between items-center border-b pb-3">
          <button className="text-lg">Cancel</button>
          <h1 className="font-medium text-base">New Thread</h1>
          <CircleEllipsis />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} action="">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={auth.user?.avatar} />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col n">
              <div className="flex items-center">
                <p className="font-medium text-base">{auth?.user?.username}</p>
                <Input
                  className="shadow-none border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Add topic"
                />
              </div>
              <Textarea
                rows={1}
                className="resize-none min-h-8 overflow-hidden border-none shadow-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("content")}
                placeholder="Bạn đang nghĩ gì?"
                onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <div className="flex items-center gap-2">
                <ImagePlus className="w-4 h-4" onClick={handleChooseImage} />
                <SmilePlus className="w-4 h-4" />
              </div>
              <div className="relative flex gap-2 mt-2 overflow-x-auto w-full max-w-xl">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="max-h-40 max-w-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 bg-white rounded-full"
                      onClick={() =>
                        setSelectedImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>  
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="border px-4 py-2 rounded-md font-medium">
              Post
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            multiple={true}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
