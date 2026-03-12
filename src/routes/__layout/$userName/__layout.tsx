import { EditProfileDialog } from "@/components/editprofile-dialog";
import { CommentDialog } from "@/components/home/comment-dialog";
import { cn } from "@/lib/utils";
import { useGetInfor } from "@/services/auth.service";
import { atomAuth } from "@/stores/auth";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useAtom } from "jotai";
import {
  Instagram,
  SquareKanban,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/__layout/$userName/__layout")({
  component: RouteComponent,
});
const nav = [
  {
    id: "",
    to: "/$userName",
    label: "Threads",
  },
  {
    id: "replies",
    to: "/$userName/replies",
    label: "Replies",
  },
  {
    id: "media",
    to: "/$userName/media",
    label: "Media",
  },
  {
    id: "reposts",
    to: "/$userName/reposts",
    label: "Reposts",
  },
] as const;

function RouteComponent() {
  const [auth] = useAtom(atomAuth);
  const { userName } = Route.useParams();
  const [openEdit, setOpenEdit] = useState(false);
  const { data: user } = useGetInfor(userName);
  const [activeTab, setActiveTab] = useState<string>("");
  const checkMe = auth.user?.username === userName;
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  if(!user) return null;
  
  return (
    <div className="max-w-2xl w-full border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{user?.name  }</h1>
          <h1 className="text-xl">{user?.username}</h1>
          <p className="text-sm leading-relaxed whitespace-pre-line">{user?.bio}</p>
        </div>
        <div className="w-21 h-21 rounded-full overflow-hidden">
          <img className="w-full h-full"
            src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <p>200 followers</p>
        <div className="flex items-center gap-2">
          <SquareKanban className="rotate-180" />
          <Instagram />
        </div>
      </div>
       {
        checkMe ? (<button className="font-medium mt-4 border w-full py-2 rounded-2xl cursor-pointer" onClick={() => setOpenEdit(true)}>
        Edit Profile
      </button>) : (<button className="font-medium mt-4 bg-black text-white w-full py-2 rounded-2xl cursor-pointer">
        Follow
      </button>)
       }
      <div className="flex justify-between border-b">
        {nav.map((item) => (
          <Link 
            key={item.id} 
            to={item.to}
            params={{ userName }}
            className="flex-1"
          >
          <button
            className={cn(
              "py-4 font-medium w-full transition-colors",
              "rounded-t-lg",
              activeTab === item.id
                ? "border-b border-black text-black"
                : "text-[#999999]",
            )}
            onClick={() => setActiveTab(item.id)}
            
          >
            {item.label}
          </button></Link>
        ))}
      </div>
      <Outlet />
      <CommentDialog open={isCommentOpen} onOpenChange={setIsCommentOpen} />
      <EditProfileDialog open={openEdit} onOpenChange={setOpenEdit}/>
    </div>
  );
}

