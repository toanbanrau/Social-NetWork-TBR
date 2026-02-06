import { EditProfileDialog } from "@/components/editprofile-dialog";
import { CommentDialog } from "@/components/home/comment-dialog";
import PostItem from "@/components/home/post-item";
import { cn } from "@/lib/utils";
import { useGetInfor } from "@/services/auth.service";
import { useGetPostsByUserId } from "@/services/post.service";
import { atomAuth } from "@/stores/auth";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import {
  Camera,
  Edit,
  Instagram,
  SquareKanban,
  SquarePen,
  Users,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/__layout/$userName/")({
  component: RouteComponent,
});

const nav = [
  {
    id: "threads",
    label: "Threads",
  },
  {
    id: "replies",
    label: "Replies",
  },
  {
    id: "media",
    label: "Media",
  },
  {
    id: "report",
    label: "Report",
  },
];

function RouteComponent() {
  const [auth] = useAtom(atomAuth);
  const { userName } = Route.useParams();
  const [openEdit, setOpenEdit] = useState(false);
  const { data: user } = useGetInfor(userName);
  const { data: posts } = useGetPostsByUserId(user?.id || "");
  const [activeTab, setActiveTab] = useState<string>("threads");
  const checkMe = auth.user?.username === userName;
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentPost, setCommentPost] = useState<any>();

  if(!user) return null;
  
  return (
    <div className="max-w-2xl w-full border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-sm leading-relaxed whitespace-pre-line">{user?.bio}</p>
        </div>
        <div className="w-21 h-21 rounded-full overflow-hidden">
          <img
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
        checkMe ? (<button className="font-medium mt-4 border w-full py-2 rounded-2xl" onClick={() => setOpenEdit(true)}>
        Edit Profile
      </button>) : (<button className="font-medium mt-4 bg-black text-white w-full py-2 rounded-2xl">
        Follow
      </button>)
       }
      <div className="flex justify-between border-b">
        {nav.map((item) => (
          <button
            key={item.id}
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
          </button>
        ))}
      </div>
      <div>
        <div className="flex justify-between">
          <p className="font-medium">Finish your profile</p>
          <p>4 left</p>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 items-center bg-[#f6f6f7] px-2 py-4 rounded-2xl">
            <div className="px-4 border rounded-full p-4 bg-white">
              <SquarePen />
            </div>
            <p className="font-medium">Create thread</p>
            <p className="text-[#999999] text-xs">
              Say what’s on your mind or share a recent highlight.
            </p>
            <button className="mt-2 bg-black text-white w-full py-1 rounded-full font-medium">
              Create
            </button>
          </div>
          <div className="flex flex-col gap-2 items-center bg-[#f6f6f7] px-2 py-4 rounded-2xl">
            <div className="px-4 border rounded-full p-4 bg-white">
              <Users />
            </div>
            <p className="font-medium">See Profile</p>
            <p className="text-[#999999] text-xs">
              Say what’s on your mind or share a recent highlight.
            </p>
            <button className="mt-2 bg-black text-white w-full py-1 rounded-full font-medium">
              See Profile
            </button>
          </div>
          <div className="flex flex-col gap-2 items-center bg-[#f6f6f7] px-2 py-4 rounded-2xl">
            <div className="px-4 border rounded-full p-4 bg-white">
              <Camera />
            </div>
            <p className="font-medium">Add Media</p>
            <p className="text-[#999999] text-xs">
              Say what’s on your mind or share a recent highlight.
            </p>
            <button className="mt-2 bg-black text-white w-full py-1 rounded-full font-medium">
              Add
            </button>
          </div>
        </div>
        <div>
          {posts?.map((item) => (
             <PostItem setCommentPost={setCommentPost} setIsCommentOpen={setIsCommentOpen} key={item.id} post={item}/>
          ))}
        </div>
      </div>
      <CommentDialog open={isCommentOpen} onOpenChange={setIsCommentOpen} />
      <EditProfileDialog open={openEdit} onOpenChange={setOpenEdit}/>
    </div>
  );
}
