import {
  Car,
  Users,
  Navigation,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "secondary" | "accent" | "success" | "warning" | "destructive";
  trend?: "up" | "down";
}

const StatCard = ({ title, value, change, icon: Icon, color, trend }: StatCardProps) => {
  const colorClasses = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    accent: "bg-accent/20 text-accent",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    destructive: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === "up" ? "text-success" : "text-destructive"
          )}>
            {trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
};

interface ActivityItem {
  id: string;
  type: "dispatch" | "complete" | "cancel" | "assign";
  message: string;
  time: string;
}

const activities: ActivityItem[] = [
  { id: "1", type: "dispatch", message: "Trip #1247 dispatched to Driver Ahmad", time: "2 min ago" },
  { id: "2", type: "complete", message: "Trip #1245 completed successfully", time: "5 min ago" },
  { id: "3", type: "assign", message: "Driver Sara assigned to Zone B", time: "8 min ago" },
  { id: "4", type: "cancel", message: "Trip #1244 cancelled by rider", time: "12 min ago" },
  { id: "5", type: "dispatch", message: "Trip #1243 dispatched to Driver Ali", time: "15 min ago" },
  { id: "6", type: "complete", message: "Trip #1242 completed successfully", time: "20 min ago" },
];

const activityStyles = {
  dispatch: { icon: Zap, color: "text-primary", bg: "bg-primary/20" },
  complete: { icon: CheckCircle, color: "text-success", bg: "bg-success/20" },
  cancel: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/20" },
  assign: { icon: Car, color: "text-accent", bg: "bg-accent/20" },
};

const quickActions = [
  { title: "New Trip", icon: Navigation, href: "/trip-request", color: "primary" },
  { title: "View Graph", icon: Activity, href: "/graph", color: "secondary" },
  { title: "Find Path", icon: TrendingUp, href: "/shortest-path", color: "accent" },
  { title: "Analytics", icon: Clock, href: "/analytics", color: "success" },
];

import { useAuth } from "@/lib/auth-context";
import { Link } from "react-router-dom";
import DriverDashboard from "./DriverDashboard";
import UserDashboard from "./UserDashboard";

const AdminDashboardContent = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of the dispatch system</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-success">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Trips"
          value={24}
          change={12}
          trend="up"
          icon={Navigation}
          color="primary"
        />
        <StatCard
          title="Available Drivers"
          value={18}
          change={5}
          trend="up"
          icon={Car}
          color="success"
        />
        <StatCard
          title="Completed Today"
          value={156}
          change={8}
          trend="up"
          icon={CheckCircle}
          color="accent"
        />
        <StatCard
          title="Cancelled"
          value={7}
          change={3}
          trend="down"
          icon={XCircle}
          color="destructive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <span className="text-sm text-muted-foreground">Last 30 minutes</span>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const style = activityStyles[activity.type];
              const Icon = style.icon;
              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-slide-up",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn("p-2 rounded-lg", style.bg)}>
                    <Icon className={cn("h-4 w-4", style.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className="glass-card-hover p-4 text-center group"
                >
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-transform group-hover:scale-110",
                    action.color === "primary" && "bg-primary/20",
                    action.color === "secondary" && "bg-secondary/20",
                    action.color === "accent" && "bg-accent/20",
                    action.color === "success" && "bg-success/20",
                  )}>
                    <Icon className={cn(
                      "h-6 w-6",
                      action.color === "primary" && "text-primary",
                      action.color === "secondary" && "text-secondary",
                      action.color === "accent" && "text-accent",
                      action.color === "success" && "text-success",
                    )} />
                  </div>
                  <div className="text-sm font-medium text-foreground">{action.title}</div>
                </Link>
              );
            })}
          </div>

          {/* System Health */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-4">System Health</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">CPU Usage</span>
                  <span className="text-foreground font-medium">45%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-primary to-accent" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="text-foreground font-medium">62%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-secondary to-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground font-medium">28%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-accent to-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Overview */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Driver Overview</h2>
          <a href="/drivers" className="text-sm text-primary hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-success/10 border border-success/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/20">
                <Car className="h-4 w-4 text-success" />
              </div>
              <span className="font-medium text-foreground">Available</span>
            </div>
            <div className="text-2xl font-bold text-success">18</div>
            <p className="text-sm text-muted-foreground">Ready to dispatch</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/20">
                <Navigation className="h-4 w-4 text-warning" />
              </div>
              <span className="font-medium text-foreground">On Trip</span>
            </div>
            <div className="text-2xl font-bold text-warning">24</div>
            <p className="text-sm text-muted-foreground">Currently assigned</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-muted">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-medium text-foreground">Offline</span>
            </div>
            <div className="text-2xl font-bold text-muted-foreground">8</div>
            <p className="text-sm text-muted-foreground">Not available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { role } = useAuth();

  if (role === "driver") return <DriverDashboard />;
  if (role === "user") return <UserDashboard />;

  return <AdminDashboardContent />;
}
