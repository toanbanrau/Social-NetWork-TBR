import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

export const Route = createFileRoute("/__layout/search")({
  component: RouteComponent,
});

const user = [
  {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    avatar: "https://i.pravatar.cc/150?img=1",
    followers: 120,
    description: "Web developer and tech enthusiast.",
  },
    {
    id: 2,
    name: "John Doe",
    username: "johndoe",
    avatar: "https://i.pravatar.cc/150?img=1",
    followers: 120,
    description: "Web developer and tech enthusiast.",
  }
]

function RouteComponent() {
  return (
    <div className=" max-w-2xl w-full border rounded-2xl">
      <div className="m-4 flex items-center p-2 border rounded-2xl">
        <SearchIcon className="text-[#999999] w-4 h-4" />{" "}
        <Input placeholder="Search" className="border-none shadow-none focus-visible:ring-0" />
      </div>
      <div className="m-4">
        <p className="text-[#999999] font-medium text-sm">Follow Suggestions</p>
      </div>
      <div className="w-full flex flex-col gap-4">
        {
          user.map((item) => (
            <div className="w-full flex gap-2">
              <div className="ml-4"><img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full" /></div>
              <div className="flex flex-1 justify-between border-b pb-4">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-md">{item.username}</p>
                  <p className="text-gray-400">{item.name}</p>
                  <span className="text-gray-400">{item.followers} followers</span>
                </div>
                <div>
                   <button className="bg-black text-white px-4 py-2 rounded-md mr-4">Follow</button>
                </div>
              </div>  
            </div>
          )
          )
        }
      </div>
    </div>
  );
}
