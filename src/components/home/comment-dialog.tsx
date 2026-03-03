import { Dialog, DialogContent } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import type { IPost, IPostForm, ICommentForm } from "@/types/post.type";
import { upload } from "../../services/upload";
import { createComment } from "@/services/post.service";
import { CircleEllipsis, ImagePlus, SmilePlus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { atomAuth } from "@/stores/auth";
import { useAtom } from "jotai";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts?: IPost;
  commentId?: string;
}

export function CommentDialog({ open, onOpenChange, posts, commentId }: CommentDialogProps) {
  const [auth] = useAtom(atomAuth);
  const { register, handleSubmit } = useForm<ICommentForm>();
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

  const onSubmit = async (data: ICommentForm) => {
    const images: string[] = [];
    for (const file of selectedImages) {
      const uploaded = await upload(file);
      images.push(uploaded.secure_url);
    }
    const comment: ICommentForm = {
      content: data.content,
      postId: posts?.id || "",
      userId: auth?.user?.id || "",
      parentId: commentId || null,
    };
    createComment(comment);
    onOpenChange(false);
    setSelectedImages([]);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl w-full">
        <div className="flex justify-between items-center border-b pb-3">
          <button>Cancel</button>
          <h1 className="font-medium text-xl">Reply</h1>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          <CircleEllipsis />
        </div>
        <div>
          <div className="flex gap-3">
             <div className="flex flex-col items-center gap-2">
                 <Avatar>
              <AvatarImage src={"/placeholder.svg"} />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className="h-full w-0 border"></div>
             </div>
            <div className="flex flex-1 flex-col n">
              <div className="flex items-center">
                <p>tonton_04</p>
                <p className="text-xs text-muted-foreground ml-2">• {new Date(posts?.createdAt || "").toLocaleDateString("vi-VN")}</p>
              </div>
              <p className="text-sm">{posts?.content}</p>
              <div className="relative flex gap-2 mt-2 overflow-x-auto w-full max-w-xl">
                {posts?.images && posts.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={file}
                      alt="preview"
                      className="max-h-40 max-w-40 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} action="">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={"/placeholder.svg"} />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col n">
              <div className="flex items-center">
                <p>tonton_04</p>
                <Input
                  className="shadow-none border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Add topic"
                />
              </div>
              <Textarea
                rows={1}
                className="resize-none min-h-8 overflow-hidden border-none shadow-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register("content")}
                placeholder="Add a comment..."
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
            <button type="submit" className="border px-4 py-2 rounded-md">
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
