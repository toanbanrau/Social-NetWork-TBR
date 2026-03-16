import { Dialog, DialogContent } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import type { IPostForm } from "@/types/post.type";
import { upload } from "../../services/upload";
import { creatPosts } from "@/services/post.service";
import { CircleEllipsis, ImagePlus, SmilePlus, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { atomAuth } from "@/stores/auth";
import { useAtom } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDialog({ open, onOpenChange }: CreateDialogProps) {
  const [auth] = useAtom(atomAuth);
  const { register, handleSubmit, setValue, getValues, reset } = useForm<IPostForm>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    const currentContent = getValues("content") || "";
    setValue("content", currentContent + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const createPostMutation = useMutation({
    mutationFn: creatPosts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onOpenChange(false);
      setSelectedImages([]);
      reset();
      toast.success("Bài viết đã được đăng thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi đăng bài. Vui lòng thử lại!");
    }
  });

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
    
    createPostMutation.mutate(post as any);
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
            <div className="flex flex-col items-center gap-2">
              <Avatar>
                <AvatarImage src={auth.user?.avatar} />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="border h-full"></div>
            </div>
            <div className="flex flex-1 flex-col items-start">
              <div className="flex gap-2 items-center">
                <p className="font-medium text-base">{auth?.user?.username}</p>
                <input
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
                <ImagePlus className="w-4 h-4 cursor-pointer" onClick={handleChooseImage} />
                <div className="relative">
                  <SmilePlus className="w-4 h-4 cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                  {showEmojiPicker && (
                    <div className="absolute top-6 left-0 z-50">
                      <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                    </div>
                  )}
                </div>
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
            <button 
              type="submit" 
              className="border px-4 py-2 rounded-md font-medium disabled:opacity-50"
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? "Posting..." : "Post"}
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
