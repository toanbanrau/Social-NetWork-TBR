import { useGetRepliesByUserId } from "@/services/post.service";
import { useGetInfor } from "@/services/auth.service";
import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, Heart, Reply } from "lucide-react";
import { useState, useEffect } from "react";
import type { IPost, IUser } from "@/types/post.type";
import { axiosIntance } from "@/utils/api";

export const Route = createFileRoute("/__layout/$userName/__layout/replies/")({
  component: RouteComponent,
});

interface ReplyWithParent {
  reply: IPost;
  parentPost: IPost | null;
  parentUser: IUser | null;
}

async function fetchParentPost(parentId: string): Promise<IPost | null> {
  try {
    const { data } = await axiosIntance.get(`/posts/${parentId}?_expand=user&_embed=likes`);
    return data || null;
  } catch {
    return null;
  }
}

function ReplyCard({ replyData }: { replyData: ReplyWithParent }) {
  const navigate = useNavigate();
  const { reply, parentPost, parentUser } = replyData;

  const handleNavigateToPost = () => {
    if (parentPost) {
      const userName = parentUser?.username || parentPost.userId;
      navigate({
        to: "/$userName/post/$postId",
        params: { userName, postId: parentPost.id },
      });
    }
  };

  return (
    <Card className="mb-4 border-border/60 bg-card/50">
      {/* Parent Post */}
      {parentPost && (
        <div 
          className="px-4 pt-4 pb-2 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={handleNavigateToPost}
        >
          <div className="flex items-center gap-2 mb-2">
            <Reply className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Replying to</span>
          </div>
          
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={parentUser?.avatar} />
              <AvatarFallback>{parentUser?.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{parentUser?.username || "Unknown"}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(parentPost.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {parentPost.content}
              </p>
              {parentPost.images && parentPost.images.length > 0 && (
                <div className="mt-2 flex gap-1 overflow-x-auto">
                  {parentPost.images.slice(0, 2).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  ))}
                  {parentPost.images.length > 2 && (
                    <span className="text-xs text-muted-foreground self-center">
                      +{parentPost.images.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center justify-center py-1">
        <div className="h-4 w-[1px] bg-border"></div>
      </div>

      {/* User's Reply */}
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={reply.user?.avatar} />
            <AvatarFallback>{reply.user?.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{reply.user?.username || "Unknown"}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed whitespace-pre-line pl-13">
          {reply.content}
        </p>
        {reply.images && reply.images.length > 0 && (
          <div className="mt-3 pl-13 flex gap-2 overflow-x-auto">
            {reply.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="w-20 h-20 object-cover rounded-md"
              />
            ))}
          </div>
        )}
        
        {/* Reply actions */}
        <div className="flex items-center gap-4 mt-3 pl-13">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{reply.likes?.length || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RouteComponent() {
  const { userName } = Route.useParams();
  const { data: user } = useGetInfor(userName);
  const { data: replies, isLoading } = useGetRepliesByUserId(user?.id || "");
  
  const [repliesWithParents, setRepliesWithParents] = useState<ReplyWithParent[]>([]);

  useEffect(() => {
    if (replies && replies.length > 0) {
      const fetchParents = async () => {
        const results = await Promise.all(
          replies.map(async (reply) => {
            const parentId = reply.parentId || reply.postId;
            if (!parentId) {
              return {
                reply,
                parentPost: null,
                parentUser: null,
              };
            }
            
            const parentPost = await fetchParentPost(parentId);
            return {
              reply,
              parentPost,
              parentUser: parentPost?.user || null,
            };
          })
        );
        setRepliesWithParents(results);
      };
      
      fetchParents();
    } else {
      setRepliesWithParents([]);
    }
  }, [replies]);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <div className="animate-pulse">Loading replies...</div>
      </div>
    );
  }

  if (!replies || replies.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No replies yet</p>
        <p className="text-sm mt-1">When you reply to posts or comments, they'll show up here.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Replies</h2>
      {repliesWithParents.map((item) => (
        <ReplyCard key={item.reply.id} replyData={item} />
      ))}
    </div>
  );
}

