import { CommentDialog } from "@/components/home/comment-dialog";
import CommentItem from "@/components/home/comment-item";
import PostItem from "@/components/home/post-item";
import { useGetPostById } from "@/services/post.service";
import type { IPost } from "@/types/post.type";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/__layout/$userName/post/$postId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { postId: id } = Route.useParams();
  const { data: post } = useGetPostById(id);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentPost, setCommentPost] = useState<IPost>();
  
  return (
    <div className="w-full max-w-2xl border rounded-md mb-4">
      {post && <PostItem post={post} setIsCommentOpen={setIsCommentOpen} setCommentPost={setCommentPost} />}
      <div className="border-b flex items-center justify-between px-4 pb-2">
        <span className="font-medium">Top</span>
        <span className="text-[#999999]">View Activity</span>
      </div>
      <div>
          {post && <CommentItem comment={post.comments} setIsCommentOpen={setIsCommentOpen} setCommentPost={setCommentPost}/>}
      </div>
      <CommentDialog open={isCommentOpen} onOpenChange={setIsCommentOpen} posts={commentPost} />
    </div>
  );
}
