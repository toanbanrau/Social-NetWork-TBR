import PostItem from '@/components/home/post-item'
import { useGetInfor } from '@/services/auth.service'
import { useGetPostsByUserId } from '@/services/post.service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__layout/$userName/__layout/media/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userName: username } = Route.useParams()
  const { data: user } = useGetInfor(username);
  const { data: posts } = useGetPostsByUserId(user?.id || "");
  const imagePosts = posts?.filter(post => post.images && post.images.length > 0)

  return (
    <div>
      {imagePosts?.map((item) => {
        return <PostItem key={item.id} post={item} />
      })}
    </div>
  )
}
