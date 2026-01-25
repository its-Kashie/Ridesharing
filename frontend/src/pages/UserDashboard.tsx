import {
    MapPin,
    Navigation,
    Clock,
    History,
    Star,
    CreditCard,
    Search,
    Zap,
    ArrowRight,
    Map as MapIcon,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import InteractiveMap from "@/components/InteractiveMap";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

export default function UserDashboard() {
    const { user } = useAuth();

    return (
        <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        Hello, {user?.name.split(' ')[0]}!
                    </h1>
                    <p className="text-white/40 text-sm font-medium tracking-widest uppercase mt-1">
                        Deployment Status: <span className="text-primary italic">Live</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-card px-4 py-3 border-white/5 bg-white/5 flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Credits</div>
                            <div className="text-xl font-bold text-white tracking-tighter">$240.50</div>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_-5px_hsla(var(--primary),0.5)]">
                            <Wallet className="h-5 w-5 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Booking */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-card border-white/5 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/20">
                                    <Navigation className="h-4 w-4 text-primary" />
                                </div>
                                System Navigation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-5 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsla(var(--primary),0.5)]" />
                                            <Input
                                                placeholder="Current Nexus"
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-xl focus:border-primary/50"
                                                defaultValue="Home Sector 7"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_hsla(var(--accent),0.5)]" />
                                            <Input
                                                placeholder="Target Coordinates"
                                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-xl focus:border-accent/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: "Fleet", price: "$12", icon: Zap, active: true },
                                            { name: "Prime", price: "$24", icon: Star },
                                            { name: "Volt", price: "$18", icon: Zap },
                                            { name: "Multi", price: "$32", icon: Navigation },
                                        ].map((type) => (
                                            <button
                                                key={type.name}
                                                className={cn(
                                                    "p-4 rounded-xl border transition-all duration-300 group",
                                                    type.active
                                                        ? "border-primary bg-primary/20 shadow-[0_0_20px_-10px_hsla(var(--primary),0.5)]"
                                                        : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <type.icon className={cn("h-4 w-4", type.active ? "text-primary" : "text-white/20")} />
                                                    <div className="text-xs font-black text-white">{type.price}</div>
                                                </div>
                                                <div className={cn("text-[10px] font-bold uppercase tracking-wider", type.active ? "text-white" : "text-white/30")}>{type.name}</div>
                                            </button>
                                        ))}
                                    </div>

                                    <Button className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-black shadow-xl shadow-primary/20 border-none transition-all group tracking-[0.1em]">
                                        INITIALIZE TRANSPORT
                                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                                <div className="md:col-span-3 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                    <InteractiveMap />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass-card border-white/5 bg-white/5 shadow-2xl">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 flex items-center gap-3">
                                <MapIcon className="h-4 w-4 text-secondary" />
                                Frequent Hubs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {[
                                { name: "Central Station", address: "Nexus Point Alpha", icon: Zap },
                                { name: "Corporate Office", address: "Sector 42 • Tower B", icon: MapPin },
                                { name: "Cyber Mall", address: "Retail Zone 9", icon: MapPin },
                            ].map((loc, i) => (
                                <button
                                    key={i}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
                                >
                                    <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                                        <loc.icon className="h-4 w-4 text-white/20 group-hover:text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="text-sm font-bold text-white tracking-tight">{loc.name}</div>
                                        <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider truncate">{loc.address}</div>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/5 bg-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/40 transition-all" />
                        <CardHeader>
                            <CardTitle className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Active Linkage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center relative">
                                    <Search className="h-7 w-7 text-primary animate-pulse" />
                                    <div className="absolute inset-0 rounded-2xl border border-primary/50 animate-ping opacity-20" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-lg font-black text-white tracking-tighter uppercase italic">Scanning...</div>
                                    <div className="text-[10px] text-primary font-bold uppercase tracking-widest">Awaiting Driver Bio-Link</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
