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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { deleteLike, postLike, createRepost, deleteRepost, useGetRepostByUserAndPost } from "@/services/post.service";
import { useAtom } from "jotai";
import { atomAuth } from "@/stores/auth";
import { useState } from "react";
import { getRelativeTime } from "@/utils/date";

interface PostItemProps {
  post: IPost;
  setCommentPost: (post: IPost) => void;
  setIsCommentOpen: (open: boolean) => void;
  detail: boolean;
  commentCount?: number;
}

const PostItem = ({
  post,
  detail,
  setCommentPost,
  setIsCommentOpen,
}: PostItemProps) => {
  const navigate = useNavigate();
  const [auth] = useAtom(atomAuth);
  const isLiked = post.likes?.some((like) => like.userId === auth.user?.id);
  const [liked, setLiked] = useState(isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
  const [isPending, setIsPending] = useState(false);
  const currentLike = post.likes?.find((like) => like.userId === auth.user?.id);
  const [likeId, setLikeId] = useState<string | null>(currentLike?.id ?? null);

  // Repost logic
  const { data: userReposts, refetch: refetchReposts } = useGetRepostByUserAndPost(post.id, auth.user?.id || "");
  const [isRepostPending, setIsRepostPending] = useState(false);
  
  const hasReposted = userReposts && userReposts.length > 0;
  const repostId = hasReposted ? userReposts[0].id : null;

  const handleLike = async () => {
    if (!auth.user?.id || isPending) return;

    const prevLiked = liked;
    const prevCount = likeCount;
    const prevLikeId = likeId;

    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setIsPending(true);

    try {
      if (liked && likeId) {
        await deleteLike(likeId);
        setLikeId(null);
      } else {
        const data = await postLike(post.id, auth.user.id);
        setLikeId(data.id);
      }
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      setLikeId(prevLikeId);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className={cn(" px-5 py-4 flex flex-col", detail ? "" : "border-b")}>
      <div className="flex justify-between gap-1 px-1">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={post.user.avatar} />
            <AvatarFallback>{post.id}</AvatarFallback>
          </Avatar>
        </div>
        <div className={cn("flex flex-col gap-1 flex-1", detail && "mt-2")}>
          <div className="flex justify-between items-center gap-1">
            <div className="flex items-center gap-1">
              <p 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({
                    to: "/$userName",
                    params: { userName: post.user?.username }
                  });
                }}
                className="font-semibold text-sm cursor-pointer hover:underline"
              >
                {post.user && post.user.username}
              </p>
              <p className="text-xs text-muted-foreground ">
                {getRelativeTime(post.createdAt)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
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
          {!detail && (
            <div
              onClick={() =>
                navigate({
                  to: "/$userName/post/$postId",
                  params: { userName: "toanbanrau", postId: post.id },
                })
              }
              className="pt-0 pb-0 cursor-pointer"
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
              {post.images.length > 0 && (
                <PhotoProvider>
                  <div className="flex overflow-x-auto gap-4 rouded-sm py-1">
                    {post.images &&
                      post.images.map((image, index) => (
                        <PhotoView key={index} src={image}>
                          <img
                            onClick={(e) => e.stopPropagation()}
                            key={index}
                            src={image}
                            alt="Post content"
                            className="w-full max-w-40 max-h-40 rounded-lg object-cover"
                          />
                        </PhotoView>
                      ))}
                  </div>
                </PhotoProvider>
              )}
              {/* Actions */}
            </div>
          )}
        </div>
      </div>
      {detail && (
        <div
          onClick={() =>
            navigate({
              to: "/$userName/post/$postId",
              params: { userName: "toanbanrau", postId: post.id },
            })
          }
          className="pt-0 pb-0 cursor-pointer px-2"
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
          {post.images.length > 0 && (
            <PhotoProvider>
              <div className="flex overflow-x-auto gap-4 rouded-sm py-1">
                {post.images &&
                  post.images.map((image, index) => (
                    <PhotoView key={index} src={image}>
                      <img
                        onClick={(e) => e.stopPropagation()}
                        key={index}
                        src={image}
                        alt="Post content"
                        className="w-full max-w-40 max-h-40 rounded-lg object-cover"
                      />
                    </PhotoView>
                  ))}
              </div>
            </PhotoProvider>
          )}
          {/* Actions */}
        </div>
      )}
      <div
        className={cn(
          "flex items-center gap-1",
          detail ? "px-0 border-b" : "px-8",
        )}
      >
        <Button
          onClick={handleLike}
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 text-muted-foreground hover:text-foreground",
            liked && "text-red-500 hover:text-red-600",
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          <span className="text-xs">{likeCount}</span>
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
          <span className="text-xs">{post.posts.length}</span>
        </Button>
        <Button
          onClick={async () => {
            if (!auth.user?.id || isRepostPending || post.userId === auth.user.id) return;
            setIsRepostPending(true);
            try {
              if (hasReposted && repostId) {
                await deleteRepost(repostId);
              } else {
                await createRepost(post.id, auth.user.id);
              }
              await refetchReposts();
            } catch (error) {
              console.error("Failed to toggle repost", error);
            } finally {
              setIsRepostPending(false);
            }
          }}
          disabled={isRepostPending || post.userId === auth.user?.id}
          variant="ghost"
          size="sm"
          className={cn("flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors", 
            post.userId === auth.user?.id && "opacity-50 cursor-not-allowed",
            hasReposted && "text-green-500 hover:text-green-600")}
        >
          <Repeat className={cn("h-4 w-4", hasReposted && "text-green-500")} />
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
  );
};

export default PostItem;
