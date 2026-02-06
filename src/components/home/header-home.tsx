import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";

export const HeaderHome = () => {
  const location = useLocation();

  const title = useMemo(() => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/activyty":
        return "Activity";
      case "/profile":
        return "Profile";
      case "/search":
        return "Search";
      default:
        return "Home";
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 w-full z-50 bg-card h-16 flex items-center justify-between px-5">
      <div>@</div>
      <h1 className="text-xl font-bold text-foreground">
        {title}
      </h1>
      <div />
    </header>
  );
};