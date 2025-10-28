import { Button } from "../ui/button";
import { Home, Plus, Search, Send, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NavHome = () => {
  return (
    <div className="w-full">
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex justify-around">
            <Button
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2">
              <Home className="h-4 w-4" />
              <span className="text-xs">Trang chủ</span>
            </Button>
            <Button
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2">
              <Search className="h-4 w-4" />
              <span className="text-xs">Tìm kiếm</span>
            </Button>
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2">
                <Send className="h-4 w-4" />
                <span className="text-xs">Chat</span>
              </Button>
            </Link>
            <Button
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2">
              <Plus className="h-4 w-4" />
              <span className="text-xs">Tạo</span>
            </Button>
            <Button
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2">
              <User className="h-4 w-4" />
              <span className="text-xs">Hồ sơ</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavHome;
