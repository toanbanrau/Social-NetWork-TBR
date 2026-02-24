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
import type { IComment, IPost } from "@/types/post.type";
import { useNavigate } from "@tanstack/react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem , DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAtom } from "jotai";
import { atomAuth } from "@/stores/auth";
import { useState } from "react";

interface PostItemProps {
  comment: IComment;
  setCommentPost: (comment: IPost) => void;  
  setIsCommentOpen: (open: boolean) => void;
}

const PostItem = ({
  comment,
  setCommentPost,
  setIsCommentOpen,
}: PostItemProps) => {
  const navigate = useNavigate()
  const [auth] = useAtom(atomAuth);
  const isLiked = comment.likes?.some((like) => like.userId === auth.user?.id);
  const [liked, setLiked] = useState(isLiked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length ?? 0);
  const [isPending, setIsPending] = useState(false);
  const currentLike = comment.likes?.find((like) => like.userId === auth.user?.id);
  const [likeId, setLikeId] = useState<string | null>(currentLike?.id ?? null);


  return (
    <div className="border-b">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={comment.user.avatar}/>
              <AvatarFallback>{comment.id}</AvatarFallback>
            </Avatar>
            <div className="cursor-pointer">
              <p className="font-semibold text-sm">{comment.user && comment.user.username}</p>
              <p className="text-xs text-muted-foreground ">
                {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>     
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Add To Feed</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="">Save</DropdownMenuItem>
              <DropdownMenuItem>Not Interested</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="">Mute</DropdownMenuItem>
              <DropdownMenuItem>Restric</DropdownMenuItem>
              <DropdownMenuItem>Block</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="">Mute</DropdownMenuItem>
              <DropdownMenuItem>Restric</DropdownMenuItem>
              <DropdownMenuItem>Block</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
       
        </div>
      </CardHeader>
      <CardContent
        onClick={() =>
          navigate({
            to: "/$userName/post/$commentId",
            params: { userName: "toanbanrau", commentId: comment.id },
          })
        }
        className="pt-0 pb-0 cursor-pointer"
      >
        <p className="text-sm mb-3 leading-relaxed whitespace-pre-line">
          {comment.content}
        </p>
        <PhotoProvider>
          <div className="flex overflow-x-auto gap-4">
            {comment.images &&
              comment.images.map((image, index) => (
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
                liked && "text-red-500 hover:text-red-600",
              )}
            >
              <Heart className={cn("h-4 w-4",liked && "fill-current")} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button
              onClick={() => {
                setCommentPost(comment);
                setIsCommentOpen(true);
              }}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comment.comments?.length ?? 0}</span>
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

