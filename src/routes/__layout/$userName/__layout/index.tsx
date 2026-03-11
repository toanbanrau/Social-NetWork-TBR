import { createFileRoute } from "@tanstack/react-router";
import { useGetPostsByUserId } from "@/services/post.service";
import PostItem from "@/components/home/post-item";
import { useGetInfor } from "@/services/auth.service";
import { Camera, SquarePen, Users } from "lucide-react";

export const Route = createFileRoute("/__layout/$userName/__layout/")({
  component: ThreadsPage,
});

function ThreadsPage() {
  const { userName } = Route.useParams();
  const { data: user } = useGetInfor(userName);

  const { data: posts } = useGetPostsByUserId(user?.id || "");

  return (
    <div>
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
          {/* {posts?.map((item) => (
             <PostItem setCommentPost={setCommentPost} setIsCommentOpen={setIsCommentOpen} key={item.id} post={item}/>
          ))} */}
        </div>
      </div>
      {posts?.map((item) => (
        <PostItem key={item.id} post={item} />
      ))}
    </div>
  );
}