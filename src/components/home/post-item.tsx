import { CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Share,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { IPost } from "@/types/post.type";
import { useNavigate } from "@tanstack/react-router";

interface PostItemProps {
  post: IPost;
  setCommentPost: (post: IPost) => void;  
  setIsCommentOpen: (open: boolean) => void;
}

const PostItem = ({
  post,
  setCommentPost,
  setIsCommentOpen,
}: PostItemProps) => {
  const navigate = useNavigate();
  const handleLike = () => {

  }
  return (
    <div className="border-b">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={"/placeholder.svg"} />
              <AvatarFallback>{post.id}</AvatarFallback>
            </Avatar>
            <div className="cursor-pointer">
              <p className="font-semibold text-sm">{post.user && post.user.username}</p>
              <p className="text-xs text-muted-foreground ">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent
        onClick={() =>
          navigate({
            to: "/$userName/post/$postId",
            params: { userName: "toanbanrau", postId: post.id },
          })
        }
        className="pt-0 pb-0 cursor-pointer"
      >
        <p className="text-sm mb-3 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
        <PhotoProvider>
          <div className="flex overflow-x-auto gap-4">
            {post.images &&
              post.images.map((image, index) => (
                <PhotoView key={index} src={image}>
                  <img
                      onClick={(e) => e.stopPropagation()}
                    key={index}
                    src={image}
                    alt="Post content"
                    className="w-full max-w-40 max-h-40 rounded-lg mb-3 object-cover"
                  />
                </PhotoView>
              ))}
          </div>
        </PhotoProvider>
        {/* Actions */}
      </CardContent>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLike}
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 text-muted-foreground hover:text-foreground",
                "text-red-500 hover:text-red-600",
              )}
            >
              <Heart className={cn("h-4 w-4", "fill-current")} />
              <span className="text-xs">{post.likes?.length ?? 0}</span>
            </Button>
            <Button
              onClick={() => {
                setCommentPost(post);
                setIsCommentOpen(true);
              }}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.comments?.length ?? 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Repeat className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
    </div>
  );
};

export default PostItem;
