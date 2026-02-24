import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useDebounce from "@/hooks/use-debound";
import { useSearchUsers } from "@/services/auth.service";
import { checkFollow, deleteFollow, postFollow } from "@/services/follower.service";
import { atomAuth } from "@/stores/auth";
import { cn } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { IUser } from "@/types/post.type";

export const Route = createFileRoute("/__layout/search")({
  component: RouteComponent,
});

const UserItem = ({ item }: { item: IUser }) => {
  const nav = useNavigate()
  const [auth] = useAtom(atomAuth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!auth.user?.id) return;
    checkFollow(auth.user.id, item.id).then((data) => {
      if (data) {
        setIsFollowing(true);
        setFollowId(data.id);
      }
    });
  }, [item.id, auth.user?.id]);

  const handleFollow = async () => {
    if (!auth.user?.id || isPending) return;

    const prevFollowing = isFollowing;
    const prevFollowId = followId;

    setIsFollowing(!isFollowing);
    setIsPending(true);

    try {
      if (isFollowing && followId) {
        await deleteFollow(followId);
        setFollowId(null);
      } else {
        const data = await postFollow(auth.user.id, item.id);
        setFollowId(data.id);
      }
    } catch {
      setIsFollowing(prevFollowing);
      setFollowId(prevFollowId);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full flex gap-2">
      <div className="ml-4">
        <img src={item.avatar} alt={item.username} className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex flex-1 justify-between border-b pb-4">
        <div className="flex flex-col gap-1">
          <p onClick={()=>nav({to:`/${item.username}`})} className="font-semibold text-md">{item.username}</p>
          <span className="text-gray-400">{item.followers.length ?? 0} followers</span>
        </div>
        <div>
           <button
          onClick={handleFollow}
          disabled={isPending}
          className={cn(
            "px-4 py-2 rounded-md mr-4 transition-colors",
            isFollowing
              ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
              : "bg-black text-white hover:bg-gray-800"
          )}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
        </div>
      </div>
    </div>
  );
};

function RouteComponent() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data: users, isPending } = useSearchUsers(debouncedQuery);

  return (
    <div className="max-w-2xl w-full border rounded-2xl">
      <div className="m-4 flex items-center p-2 border rounded-2xl">
        <SearchIcon className="text-[#999999] w-4 h-4" />
        <Input
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="m-4">
        <p className="text-[#999999] font-medium text-sm">
          {debouncedQuery ? "Search Results" : "Follow Suggestions"}
        </p>
      </div>
      <div className="flex justify-center">
        {isPending && debouncedQuery && <Spinner />}
      </div>
      <div className="w-full flex flex-col gap-4 pb-4">
        {users?.map((item) => (
          <UserItem key={item.id} item={item} />
        ))}
        {!isPending && debouncedQuery && users?.length === 0 && (
          <p className="text-center text-gray-400 text-sm pb-4">Không tìm thấy user nào</p>
        )}
      </div>
    </div>
  );
}