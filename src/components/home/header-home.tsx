import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const HeaderHome = () => {
  return (
    <header className="sticky top-0 w-full z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Toàn Bán Rau</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={"/placeholder.svg"} />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
