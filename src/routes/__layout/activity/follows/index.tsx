import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/__layout/activity/follows/")({
  component: RouteComponent,
});

const FollowsList = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

function RouteComponent() {
  return (
    <div className="max-w-2xl w-full border rounded-2xl p-4">
     {FollowsList.map((user) => (
         <div className="flex gap-2 p-4">
        <div className="flex items-center gap-4 pb-4  ">
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full bg-black"
              src="https://i.pravatar.cc/150?img=1"
              alt=""
            />
            <User className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full border border-black" />
          </div>
        </div>
        <div className="flex-1 flex justify-between border-b pb-4">
          <div className="flex flex-col">
            <p className="font-medium">
              khzlinh.23 <span className="text-border">1y</span>
            </p>
            <p>Followed you</p>
          </div>
          <button className=" bg-black text-white rounded-md font-medium px-4 py-2">
            Follow Back
          </button>
        </div>
      </div>))}
    </div>
  );
}
