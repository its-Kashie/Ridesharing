import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
    title: "Overview",
    items: [
      { title: "Landing", href: "/", icon: Home },
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Graph & Algorithms",
    items: [
      { title: "City Graph", href: "/graph", icon: Map },
      { title: "Shortest Path", href: "/shortest-path", icon: Route, badge: "DSA" },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Drivers", href: "/drivers", icon: Car },
      { title: "Dispatch Engine", href: "/dispatch", icon: Zap },
    ],
  },
  {
    title: "Trip Management",
    items: [
      { title: "State Machine", href: "/state-machine", icon: GitBranch, badge: "DSA" },
      { title: "Active Trips", href: "/active-trips", icon: Navigation },
      { title: "Rollback", href: "/rollback", icon: RotateCcw, badge: "DSA" },
      { title: "Trip History", href: "/history", icon: History },
    ],
  },
  {
    title: "Analytics & Reports",
    items: [
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "System Logs", href: "/logs", icon: ScrollText },
    ],
  },
  {
    title: "Documentation",
    items: [
      { title: "Algorithm Docs", href: "/docs", icon: BookOpen },
      { title: "Test Cases", href: "/tests", icon: TestTube },
      { title: "Team", href: "/team", icon: UsersRound },
    ],
  },
  {
    title: "System",
    items: [
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

export function AppSidebar() {
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigation = role === "admin" ? adminNavigation : role === "driver" ? driverNavigation : userNavigation;

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">RideDispatch</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        {!collapsed && <ModeToggle />}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-6">
          {navigation.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </h3>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  const linkContent = (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.title}
                          {item.badge && (
                            <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                              {item.badge}
                            </span>
                          )}
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

      {/* Collapse Button */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-muted-foreground hover:text-sidebar-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
