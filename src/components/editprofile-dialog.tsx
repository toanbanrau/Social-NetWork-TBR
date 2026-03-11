import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import type { IUser } from "@/types/user.type";
import { upload } from "@/services/upload";
import { useAtom } from "jotai";
import { atomAuth } from "@/stores/auth";
import { updateUser } from "@/services/auth.service";
import { toast } from "sonner";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditForm {
  name: string;
  username: string;
  email: string;
  bio: string;
}

export function EditProfileDialog({
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const [auth, setAuth] = useAtom(atomAuth);
  const user = auth?.user ?? null;
  const { register, handleSubmit, setValue } = useForm<EditForm>({
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      bio: user?.bio ?? "",
    },
  });

  const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setValue("name", user.name ?? "");
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("bio", user.bio ?? "");
      setPreview(user.avatar ?? null);
    }
  }, [user, setValue, open]);

  const handleChooseImage = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (data: EditForm) => {
    if (!user) return;
    try {
      let avatarUrl = user.avatar ?? null;
      if (file) {
        const uploaded = await upload(file);
        avatarUrl = uploaded.secure_url;
      }
      const payload: Partial<IUser> = {
        name: data.name,
        username: data.username,
        email: data.email,
        bio: data.bio,
        avatar: avatarUrl ?? undefined,
      };
      const updated = await updateUser(user.id, payload);
      setAuth({ user: updated, token: auth?.token ?? null });
      toast.success("Cập nhật thành công");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="flex-1 mr-4">
                <label className="text-sm font-medium">Name</label>
                <Input {...register("name")} placeholder="Your display name" />
                <label className="text-sm font-medium mt-2 block">Username</label>
                <Input {...register("username", { required: true })} />
              </div>
              <div
                onClick={handleChooseImage}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleChooseImage();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Thay ảnh đại diện"
                className="w-16 h-16 rounded-full bg-black overflow-hidden cursor-pointer shrink-0"
              >
                <Avatar className="w-full h-full">
                  <AvatarImage src={preview ?? "/placeholder.svg"} />
                  <AvatarFallback>{user?.username?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <label className="text-sm mt-2 block">Email</label>
            <Input type="email" {...register("email", { required: true })} />
            <label className="text-sm mt-2">Bio</label>
            <Textarea {...register("bio")} />
          </div>
          <div className="w-full">
            <Button className="w-full" type="submit">
              Lưu
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
