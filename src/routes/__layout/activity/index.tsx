import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { atomAuth } from '@/stores/auth'
import { useGetActivities, type IActivity } from '@/services/activity.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getRelativeTime } from '@/utils/date'
import { Heart, MessageCircle, UserPlus, Repeat2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/__layout/activity/')({
  component: RouteComponent,
})

const activityIcon = {
  like: <Heart className="w-4 h-4 text-red-500 fill-red-500" />,
  comment: <MessageCircle className="w-4 h-4 text-blue-500" />,
  follow: <UserPlus className="w-4 h-4 text-green-500" />,
  repost: <Repeat2 className="w-4 h-4 text-green-500" />,
}

const activityText = {
  like: 'đã thích bài viết của bạn',
  comment: 'đã bình luận bài viết của bạn',
  follow: 'đã bắt đầu theo dõi bạn',
  repost: 'đã chia sẻ lại bài viết của bạn',
}

const ActivityItem = ({ activity }: { activity: IActivity }) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b last:border-b-0">
      {/* User avatar with activity type badge */}
      <div className="relative shrink-0">
        <Avatar 
          className="cursor-pointer"
          onClick={() => activity.user?.username && navigate({ to: '/$userName', params: { userName: activity.user.username } })}
        >
          <AvatarImage src={activity.user?.avatar} />
          <AvatarFallback>{activity.user?.username?.charAt(0).toUpperCase() ?? '?'}</AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow">
          {activityIcon[activity.type]}
        </span>
      </div>

      {/* Activity description */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-1">
          <span 
            className="font-semibold text-sm cursor-pointer hover:underline"
            onClick={() => activity.user?.username && navigate({ to: '/$userName', params: { userName: activity.user.username } })}
          >
            {activity.user?.username ?? 'Ai đó'}
          </span>
          <span className="text-sm text-muted-foreground">{activityText[activity.type]}</span>
        </div>
        {activity.post && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
            {activity.post.content}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">
          {getRelativeTime(activity.createdAt)}
        </p>
      </div>

      {/* Post thumbnail if applicable */}
      {activity.post?.images?.[0] && (
        <img
          src={activity.post.images[0]}
          alt="post thumbnail"
          className="w-12 h-12 rounded-lg object-cover shrink-0"
        />
      )}
    </div>
  )
}

function RouteComponent() {
  const [auth] = useAtom(atomAuth)
  const { data: activities, isPending, isError } = useGetActivities(auth.user?.id ?? '')

  return (
    <div className="max-w-2xl w-full">
      <div className="px-4 py-4 border-b">
        <h1 className="font-semibold text-lg">Hoạt động</h1>
      </div>

      {isPending && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="text-center text-muted-foreground py-10 text-sm">
          Không thể tải hoạt động. Vui lòng thử lại sau.
        </p>
      )}

      {!isPending && !isError && activities?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted-foreground">
          <Heart className="w-10 h-10 opacity-20" />
          <p className="text-sm">Chưa có hoạt động nào</p>
        </div>
      )}

      {!isPending && activities && activities.length > 0 && (
        <div className="divide-y">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
