import {
    Car,
    Navigation,
    DollarSign,
    Star,
    Clock,
    CheckCircle2,
    AlertCircle,
    Map as MapIcon,
    Zap,
    ArrowRight,
    TrendingUp,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

export default function DriverDashboard() {
    const { user } = useAuth();

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Driver Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <span className="text-sm font-medium text-success">Online</span>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Net Earnings", value: "$4,240.20", icon: DollarSign, color: "text-success", bg: "bg-success/10", trend: "+12.4%" },
                    { title: "Acceptance Rate", value: "98.2%", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", trend: "+2.1%" },
                    { title: "Rating", value: "4.98", icon: Star, color: "text-accent", bg: "bg-accent/10", trend: "5.0" },
                    { title: "Online Hours", value: "142h", icon: Clock, color: "text-secondary", bg: "bg-secondary/10", trend: "+8h" },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="glass-card p-6 border border-white/5 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded">{stat.trend}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.title}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Active Trip / Next Request */}
                <Card className="lg:col-span-2 glass-card border-white/5 bg-card/50">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            New Trip Request
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground uppercase">Pickup</div>
                                            <div className="text-base font-semibold text-white">Downtown Central • Hub A</div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-0.5 bg-border ml-1.5" />
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-accent/20" />
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground uppercase">Dropoff</div>
                                            <div className="text-base font-semibold text-white">Cyber-Port Terminal 4</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                <div className="text-3xl font-bold text-white mb-1">$42.00</div>
                                <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">High Demand</div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="h-12 flex-1 rounded-xl border-white/10 hover:bg-white/5 hover:text-white">
                                Decline
                            </Button>
                            <Button className="h-12 flex-[2] rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold">
                                Accept Ride
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Driver Map / Zone Info */}
                <Card className="glass-card border-white/5 p-0 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-white/5 px-6 pt-6">
                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                            <MapIcon className="h-5 w-5 text-muted-foreground" />
                            Current Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-48 bg-muted relative flex items-center justify-center">
                            <TrendingUp className="h-16 w-16 text-muted-foreground/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-medium text-muted-foreground">Map Visualization</span>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Activity Level</span>
                                <span className="text-sm font-bold text-success">High Demand</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-success" />
                            </div>
                            <div className="text-xs text-muted-foreground text-center pt-2">
                                You are in a calibrated high-demand zone.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
