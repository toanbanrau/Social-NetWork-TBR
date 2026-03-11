import { createFileRoute } from '@tanstack/react-router'
import PostItem from "@/components/home/post-item";
import { useGetInfor } from "@/services/auth.service";
import { useGetRepostsByUserId } from "@/services/post.service";

export const Route = createFileRoute('/__layout/$userName/__layout/reposts/')({
  component: RepostsPage,
})

function RepostsPage() {
  const { userName } = Route.useParams();
  const { data: user } = useGetInfor(userName);
  const { data: reposts } = useGetRepostsByUserId(user?.id || "");

  return (
    <div>
      {reposts?.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No reposts yet.
        </div>
      )}
      {reposts?.map((item) => {
        if (!item.post) return null;
        return (
          <PostItem 
            key={item.id} 
            post={item.post} 
            detail={false} 
            setCommentPost={() => {}} 
            setIsCommentOpen={() => {}} 
          />
        );
      })}
    </div>
  )
}
