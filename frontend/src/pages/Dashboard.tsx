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
  ShieldCheck,
  ChevronRight,
  Signal,
  LayoutGrid,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Link } from "react-router-dom";
import DriverDashboard from "./DriverDashboard";
import UserDashboard from "./UserDashboard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { socket } from "@/services/socket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "primary" | "secondary" | "accent" | "success" | "warning" | "destructive";
  trend?: "up" | "down";
}

const StatCard = ({ title, value, change, icon: Icon, color, trend }: StatCardProps) => {
  const colorVariants = {
    primary: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20 shadow-blue-500/5",
    secondary: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20 shadow-purple-500/5",
    accent: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 border-fuchsia-500/20 shadow-fuchsia-500/5",
    success: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
    warning: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20 shadow-amber-500/5",
    destructive: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20 shadow-rose-500/5",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "relative overflow-hidden glass-card p-6 border-2 bg-gradient-to-br transition-all duration-300",
        colorVariants[color]
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-inner">
          <Icon className="h-6 w-6" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10",
            trend === "up" ? "text-emerald-400" : "text-rose-400"
          )}>
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-4xl font-black italic tracking-tighter text-white mb-2 leading-none">{value}</div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</div>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full blur-3xl -mr-12 -mb-12" />
    </motion.div>
  );
};

const activities = [
  { id: "1", type: "dispatch", message: "Trip #1247 dispatched to Ahmad Driver", time: "2 min ago", status: "Active" },
  { id: "2", type: "complete", message: "Trip #1245 completed successfully", time: "5 min ago", status: "Done" },
  { id: "3", type: "assign", message: "Driver John assigned to Node 4", time: "8 min ago", status: "Pending" },
  { id: "4", type: "cancel", message: "Trip #1244 cancelled by rider", time: "12 min ago", status: "Void" },
];

const activityStyles = {
  dispatch: { icon: Zap, color: "text-blue-400", bg: "bg-blue-400/20" },
  complete: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/20" },
  cancel: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-400/20" },
  assign: { icon: Car, color: "text-purple-400", bg: "bg-purple-400/20" },
};

const AdminDashboardContent = () => {
  const { user } = useAuth();
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [liveActivities, setLiveActivities] = useState(activities);

  useEffect(() => {
    socket.on("metrics_update", (data: any) => {
      setRealTimeMetrics(data);
    });

    socket.on("trip_broadcast", (data: any) => {
      const newActivity = {
        id: Date.now().toString(),
        type: "dispatch" as const,
        message: `New trip request from ${data.passengerName} (Origin: ${data.pickup})`,
        time: "Just now",
        status: "Pending"
      };
      setLiveActivities(prev => [newActivity, ...prev.slice(0, 5)]);
    });

    socket.on("trip_confirmed", (data: any) => {
      const newActivity = {
        id: Date.now().toString(),
        type: "complete" as const,
        message: `Trip confirmed by ${data.driverName} for ${data.passengerName}`,
        time: "Just now",
        status: "Active"
      };
      setLiveActivities(prev => [newActivity, ...prev.slice(0, 5)]);
    });

    socket.on("trip_finished", (data: any) => {
      const newActivity = {
        id: Date.now().toString(),
        type: "complete" as const,
        message: `Trip #8812 finalized. Driver: ${data.driverName}`,
        time: "Just now",
        status: "Done"
      };
      setLiveActivities(prev => [newActivity, ...prev.slice(0, 5)]);
    });

    return () => {
      socket.off("metrics_update");
      socket.off("trip_broadcast");
      socket.off("trip_confirmed");
      socket.off("trip_finished");
    };
  }, []);

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: api.getMetrics,
    refetchInterval: 5000,
  });

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["status"],
    queryFn: api.getStatus,
    refetchInterval: 5000,
  });

  return (
    <div className="h-screen bg-white p-6 lg:p-10 flex flex-col space-y-8 animate-fade-in max-w-screen-2xl mx-auto overflow-hidden">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-gray-100 pb-8 shrink-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[9px] font-black uppercase tracking-widest text-primary">
            <Signal className="h-3 w-3 animate-pulse" />
            System Control Panel
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900">
            MASTER <span className="text-primary">CONSOLE</span>
          </h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
            Welcome Administrator: <span className="text-slate-900">{user?.name}</span>
          </p>
        </motion.div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</div>
            <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest italic">Stable • 100% Up</div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-primary shadow-sm">
            <Activity className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable if needed but typically fits fixed size */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
        {/* Stats Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Concurrent Rides"
            value={realTimeMetrics ? realTimeMetrics.activeTrips : (metricsLoading ? "..." : 12)}
            change={12}
            trend="up"
            icon={Navigation}
            color="primary"
          />
          <StatCard
            title="Online Fleet"
            value={realTimeMetrics ? realTimeMetrics.availableDrivers : (statusLoading ? "..." : 45)}
            change={5}
            trend="up"
            icon={Car}
            color="success"
          />
          <StatCard
            title="Dispatch Latency"
            value={metricsLoading ? "..." : (metrics?.dispatchLatency || "14ms")}
            icon={Zap}
            color="warning"
          />
          <StatCard
            title="Live Nodes"
            value={metricsLoading ? "..." : (metrics?.activeNodes || 16)}
            icon={LayoutGrid}
            color="accent"
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-gray-100 bg-white shadow-sm overflow-hidden rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 px-8 py-6">
                <div>
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] italic text-primary">Neural Activity Feed</CardTitle>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Live updates from Rido Engine</p>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600">
                  <Activity className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-2">
                {liveActivities.map((activity, index) => {
                  const style = activityStyles[activity.type as keyof typeof activityStyles];
                  const Icon = style.icon;
                  // Map dark backgrounds to light
                  const lightBg = style.bg.replace('/20', '/10').replace('bg-', 'bg-');
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                      <div className={cn("p-3 rounded-xl shadow-sm", style.bg.replace('/20', '/10'))}>
                        <Icon className={cn("h-5 w-5", style.color.replace('400', '600'))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black italic text-slate-800 group-hover:text-primary transition-colors">{activity.message}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">{activity.time} • CLUSTER_A</p>
                      </div>
                      <Badge variant="outline" className="hidden sm:flex font-black text-[9px] uppercase tracking-widest border-gray-100 text-slate-400">
                        {activity.status}
                      </Badge>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Action Center */}
          <div className="lg:col-span-4 space-y-10">
            <Card className="border-gray-100 bg-white shadow-sm overflow-hidden relative rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardHeader className="border-b border-gray-50 px-8 pt-8 pb-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Global Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "DISPATCH", icon: Zap, href: "/dispatch", color: "text-blue-500" },
                    { title: "MAP_VIEW", icon: LayoutGrid, href: "/graph", color: "text-emerald-500" },
                    { title: "PATHFIND", icon: TrendingUp, href: "/shortest-path", color: "text-fuchsia-500" },
                    { title: "ANALYTICS", icon: Activity, href: "/analytics", color: "text-amber-500" },
                  ].map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.title}
                        to={action.href}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all text-center group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Icon className={cn("h-6 w-6 mb-3 transition-transform group-hover:scale-110", action.color)} />
                        <span className="text-[9px] font-black text-slate-600 hover:text-primary transition-colors uppercase tracking-[0.2em]">{action.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100 bg-white shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="px-8 pt-8 pb-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Engine Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Load Distribution</span>
                    <span className="text-xs font-black italic text-primary">{realTimeMetrics?.coreEngineLoad || 82}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${realTimeMetrics?.coreEngineLoad || 82}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Kernel Pulse</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">60hz Stable</span>
                </div>
              </CardContent>
            </Card>
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
