import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { MoreVertical, Search, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

const mockChats = [
  {
    id: 1,
    user: { name: "Nguyễn Văn A", avatar: "/diverse-user-avatars.png", username: "@nguyenvana" },
    lastMessage: "Chào bạn! Hôm nay thế nào?",
    timestamp: "10:30",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    user: { name: "Trần Thị B", avatar: "/diverse-female-avatar.png", username: "@tranthib" },
    lastMessage: "Cảm ơn bạn đã giúp đỡ!",
    timestamp: "09:15",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    user: { name: "Lê Minh C", avatar: "/male-avatar.png", username: "@leminhc" },
    lastMessage: "Hẹn gặp lại sau nhé",
    timestamp: "Hôm qua",
    unread: 1,
    online: true,
  },
]

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

export const Route = createFileRoute('/__layout/chat')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1) // Default to first chat selected
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [socket, setSocket] = useState<WebSocket | undefined>();

   useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected!");
    };

    ws.onmessage = (event) => {
      console.log("📩 Message received from backend:", event.data);
    const receivedMessage = JSON.parse(event.data);

      // Parse dữ liệu nhận từ backend
     if (receivedMessage.text) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            senderId: "bot",
            content: receivedMessage.text, // Lấy text trả về để hiển thị
            timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            isMe: false,
          },
        ]);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    // Cleanup khi component unmount
    return () => {
      ws.close();
    };
  }, []);

  const selectedChatData = mockChats.find((chat) => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        senderId: "me",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      };
      
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");

      // Gửi tin nhắn đi qua WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ text: newMessage })); // Gửi tin nhắn dưới dạng JSON
      }
    }
  };

  const filteredChats = mockChats.filter((chat) => chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-96 border-r border-border flex flex-col">
        {/* Sidebar Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-foreground">Tin nhắn</h1>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </header>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "cursor-pointer hover:bg-muted/50 transition-colors p-4 border-b border-border",
                selectedChat === chat.id && "bg-muted",
              )}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{chat.user.name}</h3>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Conversation */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <header className="bg-card border-b border-border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChatData.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{selectedChatData.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-semibold text-sm">{selectedChatData.user.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedChatData.online ? "Đang hoạt động" : "Không hoạt động"}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message) => (
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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Chọn một cuộc trò chuyện</p>
              <p className="text-sm">Chọn từ danh sách bên trái để bắt đầu nhắn tin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
