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
        <div className="p-4 md:p-6 space-y-6 animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Hello, {user?.name.split(' ')[0]}
                    </h1>
                    <p className="text-muted-foreground">where would you like to go today?</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-card px-4 py-2 border border-white/5 bg-white/5 flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase font-medium">Balance</div>
                            <div className="text-lg font-bold text-white">$240.50</div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Booking */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass-card border-white/5 bg-card/50 overflow-hidden shadow-lg">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <Navigation className="h-5 w-5 text-primary" />
                                Book a Ride
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-5 gap-6">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                                            <Input
                                                placeholder="Current Location"
                                                className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground h-12 rounded-lg"
                                                defaultValue="Home"
                                            />
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-accent" />
                                            <Input
                                                placeholder="Destination"
                                                className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground h-12 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: "Standard", price: "$12", icon: Zap, active: true },
                                            { name: "Premium", price: "$24", icon: Star },
                                            { name: "Electric", price: "$18", icon: Zap },
                                            { name: "Van", price: "$32", icon: Navigation },
                                        ].map((type) => (
                                            <button
                                                key={type.name}
                                                className={cn(
                                                    "p-3 rounded-xl border transition-all duration-200 text-left",
                                                    type.active
                                                        ? "border-primary bg-primary/10"
                                                        : "border-white/5 bg-white/5 hover:bg-white/10 "
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <type.icon className={cn("h-4 w-4", type.active ? "text-primary" : "text-muted-foreground")} />
                                                    <div className="text-sm font-bold text-white">{type.price}</div>
                                                </div>
                                                <div className={cn("text-xs font-medium", type.active ? "text-white" : "text-muted-foreground")}>{type.name}</div>
                                            </button>
                                        ))}
                                    </div>

                                    <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all">
                                        Find Driver
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                                <div className="md:col-span-3 rounded-xl overflow-hidden border border-white/5 bg-muted/20 min-h-[300px]">
                                    <InteractiveMap />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass-card border-white/5 bg-card/50">
                        <CardHeader className="pb-4 border-b border-white/5">
                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                <MapIcon className="h-5 w-5 text-muted-foreground" />
                                Recent Places
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {[
                                { name: "Central Station", address: "123 Main St", icon: Zap },
                                { name: "Office", address: "Tech Park, Bld 4", icon: MapPin },
                                { name: "Shopping Mall", address: "City Center", icon: MapPin },
                            ].map((loc, i) => (
                                <button
                                    key={i}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                                        <loc.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="text-sm font-medium text-white">{loc.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{loc.address}</div>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/5 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ride Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center relative">
                                    <Search className="h-5 w-5 text-primary" />
                                    <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-base font-bold text-white">Searching...</div>
                                    <div className="text-xs text-muted-foreground">Looking for nearby drivers</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
