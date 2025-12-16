import { MoreVertical, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    content: "Chào bạn! Hôm nay thế nào?",
    timestamp: "10:25",
    isMe: false,
  },
  {
    id: 2,
    senderId: "me",
    content: "Chào! Mình khỏe, cảm ơn bạn. Còn bạn thì sao?",
    timestamp: "10:26",
    isMe: true,
  },
  {
    id: 3,
    senderId: 1,
    content: "Mình cũng tốt. Có dự án mới gì thú vị không?",
    timestamp: "10:28",
    isMe: false,
  },
  {
    id: 4,
    senderId: "me",
    content: "Có đấy! Đang làm một app social network nhỏ. Khá thú vị đó 😊",
    timestamp: "10:30",
    isMe: true,
  },
]

const ChatWindow = () => {
  return (
        <div className="flex-1 flex flex-col">
           {/* Chat Header */}
            <header className="bg-card border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={"/placeholder.svg"} />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-semibold text-sm"></h2>
                  <p className="text-xs text-muted-foreground">
                     Đang hoạt động
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {mockMessages.map((message) => (
                <div key={message.id} className={cn("flex", message.isMe ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2",
                      message.isMe ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        message.isMe ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tin nhắn..."
                  className="flex-1"
                />
                <Button >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
      </div>
  )
}

export default ChatWindow