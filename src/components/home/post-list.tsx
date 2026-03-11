import { useState } from "react";
import { CreateDialog } from "./create-dialog";
import PostItem from "./post-item";
import { useGetPosts } from "@/services/post.service";
import { CommentDialog } from "./comment-dialog";
import type { IPost } from "@/types/post.type";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { atomAuth } from "@/stores/auth";

const PostList = () => {
  const navigate = useNavigate();
  const [auth] = useAtom(atomAuth);
  const { data: posts } = useGetPosts();
  const [open, setOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentPost, setCommentPost] = useState<IPost>();

  const handleCreatePost = () => {
    if (!auth?.token) {
      navigate({ to: "/auth" });
      return;
    }
    setOpen(true);
  };
  return (
    <div className="max-w-2xl w-full border rounded-2xl">
      <div className="flex items-center justify-between px-2 py-2 border-b">
        <div className="flex gap-4 items-center">
          <img
            className="w-10 h-10 bg-black rounded-full"
            src={auth.user?.avatar}
            alt=""
          />
          <p className="text-[#999999] text-sm">What's new</p>
        </div>
        <button
          onClick={handleCreatePost}
          className="px-4 py-1 border rounded-md cursor-pointer font-medium"
        >
          Post
        </button>
      </div>
      <div>
        {posts?.map((item) => {
          return (
            <PostItem
              detail={false}
              key={item.id}
              post={item}
              setCommentPost={setCommentPost}
              setIsCommentOpen={setIsCommentOpen}
            />
          );
        })}
      </div>
      <CreateDialog open={open} onOpenChange={setOpen} />
      <CommentDialog
        open={isCommentOpen}
        onOpenChange={setIsCommentOpen}
        posts={commentPost}
      />
    </div>
  );
};

export default PostList;
