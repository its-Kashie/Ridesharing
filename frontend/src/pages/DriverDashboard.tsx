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
        <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-success/80 to-primary/80 flex items-center justify-center shadow-lg shadow-success/20 relative">
                        <Car className="h-8 w-8 text-white" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-success border-2 border-background rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Pilot Interface</h1>
                        <p className="text-white/40 text-sm font-medium tracking-widest uppercase mt-1">
                            Unit: <span className="text-success font-bold">{user?.name}</span> • Status: <span className="text-success italic">Combat Ready</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-12 border-white/10 bg-white/5 text-white/50 hover:bg-destructive/10 hover:text-destructive transition-all rounded-xl uppercase tracking-widest font-bold text-xs">
                        Deactivate Hub
                    </Button>
                    <div className="glass-card px-4 py-3 bg-primary/10 border-primary/20">
                        <div className="flex items-center gap-3">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live Telemetry</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Net Revenue", value: "$4,240.20", icon: DollarSign, color: "text-success", bg: "bg-success/20", trend: "+12.4%" },
                    { title: "Task Success", value: "98.2%", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/20", trend: "+2.1%" },
                    { title: "Bio-Rating", value: "4.98", icon: Star, color: "text-accent", bg: "bg-accent/20", trend: "0.0" },
                    { title: "Sync Duration", value: "142h", icon: Clock, color: "text-secondary", bg: "bg-secondary/20", trend: "+8h" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="glass-card p-6 border-white/5 bg-white/5 backdrop-blur-3xl group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-xl transition-all group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                            <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">{stat.trend}</Badge>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">{stat.title}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Active Trip / Next Request */}
                <Card className="lg:col-span-2 glass-card border-none bg-gradient-to-br from-primary/20 via-white/5 to-accent/20 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20 animate-pulse">
                                <Zap className="h-4 w-4 text-primary fill-primary" />
                            </div>
                            Incoming Mission Request
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8 p-6 rounded-2xl bg-white/5 border border-white/5 relative z-10">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_hsla(var(--primary),0.5)]" />
                                        <div>
                                            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Origin</div>
                                            <div className="text-lg font-bold text-white tracking-tight">Downtown Central • Hub A</div>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-gradient-to-b from-primary to-accent ml-1.5 opacity-30" />
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_hsla(var(--accent),0.5)]" />
                                        <div>
                                            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Objective</div>
                                            <div className="text-lg font-bold text-white tracking-tight">Cyber-Port Terminal 4</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center items-end border-l border-white/5 pl-8">
                                <div className="text-4xl font-black text-white tracking-tighter mb-1">$42.00</div>
                                <div className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">High Yield Entry</div>
                            </div>
                        </div>
                        <div className="flex gap-4 relative z-10">
                            <Button variant="outline" className="h-14 flex-1 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white/40 font-bold uppercase tracking-widest">
                                DECLINE
                            </Button>
                            <Button className="h-14 flex-[2] rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-black shadow-xl shadow-primary/20 border-none transition-all group tracking-[0.2em]">
                                ACCEPT ASSIGNMENT
                                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Driver Map / Zone Info */}
                <Card className="glass-card border-white/5 bg-white/5 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white/70 flex items-center gap-3">
                            <MapIcon className="h-4 w-4 text-secondary" />
                            Grid Intelligence
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-64 bg-[#0a0b14] relative flex items-center justify-center">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                            <TrendingUp className="h-32 w-32 text-primary opacity-5 animate-pulse" />
                            <div className="z-10 text-center">
                                <Badge className="bg-success/20 text-success border-success/30 uppercase tracking-widest text-[10px] mb-2 font-black italic">Peak Demand</Badge>
                                <div className="text-xs font-bold text-white/50 tracking-widest uppercase">Sector 7 Active</div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Hot Zone</span>
                                <span className="text-xs font-bold text-white uppercase italic">Neo-Tokyo District</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-gradient-to-r from-primary to-accent" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
