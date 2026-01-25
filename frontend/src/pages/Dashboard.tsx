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
  ArrowDownRight,
  ShieldCheck
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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const AdminDashboardContent = () => {
  const { user } = useAuth();
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: api.getMetrics,
    refetchInterval: 2000,
  });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["status"],
    queryFn: api.getStatus,
    refetchInterval: 2000,
  });

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-success"></span>
          <span className="text-sm text-muted-foreground">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Trips"
          value={metricsLoading ? "..." : (status?.drivers || 0)}
          change={12}
          trend="up"
          icon={Navigation}
          color="primary"
        />
        <StatCard
          title="Available Drivers"
          value={metricsLoading ? "..." : (status?.drivers || 0)}
          change={5}
          trend="up"
          icon={Car}
          color="success"
        />
        <StatCard
          title="Avg Dispatch Time"
          value={metricsLoading ? "..." : (metrics?.dispatchLatency || "0ms")}
          icon={Zap}
          color="warning"
        />
        <StatCard
          title="Active Nodes"
          value={metricsLoading ? "..." : (metrics?.activeNodes || 0)}
          icon={Activity}
          color="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-1">
            {activities.map((activity, index) => {
              const style = activityStyles[activity.type];
              const Icon = style.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                >
                  <div className={cn("p-2.5 rounded-lg", style.bg)}>
                    <Icon className={cn("h-4 w-4", style.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions & Health */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-secondary/10 hover:bg-secondary/20 border border-transparent hover:border-secondary/30 transition-all text-center group"
                  >
                    <Icon className={cn("h-6 w-6 mb-2 text-secondary group-hover:scale-110 transition-transform")} />
                    <span className="text-xs font-medium text-white">{action.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Driver Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-md">
                    <Car className="h-4 w-4 text-success" />
                  </div>
                  <span className="font-medium text-white">Available</span>
                </div>
                <span className="text-xl font-bold text-success">18</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/20 rounded-md">
                    <Navigation className="h-4 w-4 text-warning" />
                  </div>
                  <span className="font-medium text-white">On Trip</span>
                </div>
                <span className="text-xl font-bold text-warning">24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { role, user } = useAuth();

  if (role === "driver") return <DriverDashboard />;
  if (role === "user") return <UserDashboard />;

  return <AdminDashboardContent />;
}
