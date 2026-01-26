import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Route,
  Users,
  Car,
  Navigation,
  Zap,
  GitBranch,
  RotateCcw,
  History,
  BarChart3,
  FileText,
  ScrollText,
  BookOpen,
  TestTube,
  UsersRound,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

import { useAuth } from "@/lib/auth-context";

const adminNavigation: NavGroup[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Live Map", href: "/graph", icon: Map },
      { title: "Trip Activity", href: "/active-trips", icon: Navigation },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Statistics", href: "/analytics", icon: BarChart3 },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const driverNavigation: NavGroup[] = [
  {
    title: "Driver Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Active Trip", href: "/active-trips", icon: Navigation },
      { title: "Earnings", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "History", href: "/history", icon: History },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const userNavigation: NavGroup[] = [
  {
    title: "User Portal",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Book Ride", href: "/dispatch", icon: Zap },
    ],
  },
  {
    title: "My Activity",
    items: [
      { title: "Trip History", href: "/history", icon: History },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

import { ModeToggle } from "@/components/mode-toggle";

interface AppSidebarProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function AppSidebar({ onNavigate, isMobile }: AppSidebarProps) {
  const { role, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigation = role === "admin" ? adminNavigation : role === "driver" ? driverNavigation : userNavigation;

  const sidebarCollapsed = isMobile ? false : collapsed;

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isMobile ? "w-full" : sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">RideFlow</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        {!sidebarCollapsed && <div className="w-8" />} {/* Spacer to balance layout without theme toggle */}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="flex flex-col gap-8">
          {navigation.map((group) => (
            <div key={group.title} className="space-y-4">
              {!sidebarCollapsed && (
                <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/40">
                  {group.title}
                </h3>
              )}
              <div className="flex flex-col gap-1.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  const linkContent = (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-300 relative overflow-hidden",
                        isActive
                          ? "bg-primary/20 text-primary shadow-[inset_0_0_20px_rgba(var(--primary),0.1)]"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" />}
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-all duration-300",
                          isActive ? "text-primary scale-110" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground group-hover:scale-110"
                        )}
                      />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 uppercase tracking-widest">{item.title}</span>
                          {item.badge && (
                            <span className="rounded-lg bg-sidebar-accent border border-sidebar-border px-1.5 py-0.5 text-[8px] font-black text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );

                  if (sidebarCollapsed) {
                    return (
                      <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="bg-popover border-border text-foreground font-bold text-[10px] uppercase tracking-widest">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile / Logout */}
      <div className="mt-auto border-t border-sidebar-border p-4 bg-sidebar-accent/50">
        <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-sidebar-border overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <Users className="h-5 w-5 text-sidebar-foreground/50" />}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-sidebar-foreground truncate uppercase tracking-tighter italic">{user?.name || "Guest User"}</div>
              <div className="text-[9px] font-bold text-sidebar-foreground/50 truncate uppercase tracking-widest">{user?.role || "external"} • ACTIVE</div>
            </div>
          )}
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const { logout } = useAuth(); // or just use the logout from scope if available
                window.location.href = "/login";
              }}
              className="text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 shrink-0"
            >
              <LogIn className="h-4 w-4 rotate-180" />
            </Button>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      {!isMobile && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </aside>
  );
}

