import { createFileRoute } from "@tanstack/react-router";
import PostList from "@/components/home/post-list";

export const Route = createFileRoute("/__layout/")({
  component: Component,
});

function Component() {
  return (
        <div className="flex flex-1 items-center justify-center">
        <PostList />
        </div>
  );
}
