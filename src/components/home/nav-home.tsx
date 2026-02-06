import { Button } from "../ui/button";
import { Heart, Home, Plus, Search, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { atomAuth } from "@/stores/auth";



const NavHome = () => {
  const [auth] = useAtom(atomAuth);
  const [active, setActive] = useState("/");
  const navItems = [
    {icon: Home, path: "/" },
    {icon: Search, path: "/search" },
    {icon: Plus, path: "/create" },
    {icon: Heart, path: "/activity" },
    {icon: User, path: (auth?.user?.username ? `/${auth.user.username}` : "/auth") },
  ];
  return (
      <nav className="fixed left-0 top-0 bg-card h-screen border-t border-border">
          <div className="h-full flex flex-col items-center justify-center gap-6 p-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setActive(item.path)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("flex flex-col items-center gap-1 h-auto py-2", active === item.path && "bg-primary/10 text-primary")}>
                  <item.icon className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
      </nav>
  );
};

export default NavHome;
