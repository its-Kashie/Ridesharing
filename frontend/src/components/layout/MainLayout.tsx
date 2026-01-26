import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MainLayout() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full bg-gray-50 overflow-hidden">
        {!isMobile && <AppSidebar />}

        <main className="flex-1 overflow-auto flex flex-col">
          {isMobile && (
            <header className="h-16 border-b border-sidebar-border bg-sidebar/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sidebar-foreground">RideFlow</span>
              </div>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 border-r-sidebar-border bg-sidebar">
                  <AppSidebar onNavigate={() => setOpen(false)} isMobile />
                </SheetContent>
              </Sheet>
            </header>
          )}
          <div className="flex-1 p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
