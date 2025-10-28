import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, MoreHorizontal, Share } from "lucide-react";
import { cn } from "../../lib/utils";
import type { IPost } from "@/types/post.type";

const PostItem = ({ post }: { post: IPost }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={"/placeholder.svg"} />
              <AvatarFallback>{post.id}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">Toàn Bán Rau</p>
              <p className="text-xs text-muted-foreground">
                Toàn Bán Gà •{" "}
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm mb-3 leading-relaxed">{post.content}</p>

        <img
          src={post.images}
          alt="Post content"
          className="w-full rounded-lg mb-3 object-cover"
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t ">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 text-muted-foreground hover:text-foreground",
                "text-red-500 hover:text-red-600"
              )}>
              <Heart className={cn("h-4 w-4", "fill-current")} />
              <span className="text-xs">29</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Quá Tuyệt Vời</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostItem;
