import { createFileRoute } from "@tanstack/react-router";
import { HeaderHome } from "../components/home/header-home";
import CreatPost from "../components/home/create-post";
import NavHome from "../components/home/nav-home";
import PostList from "../components/home/post-list";

export const Route = createFileRoute("/")({
  component: Component,
});

function Component() {
  return (
    <main className="max-w-screen scroll-auto">
      <HeaderHome />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <CreatPost />
        <PostList />
      </div>
      <NavHome />
      <div className="h-20"></div>
    </main>
  );
}
