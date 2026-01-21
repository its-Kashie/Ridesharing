import {
    Car,
    Navigation,
    DollarSign,
    Star,
    Clock,
    CheckCircle2,
    AlertCircle,
    Map,
    Zap,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DriverDashboard() {
    return (
        <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Driver Portal</h1>
                    <p className="text-muted-foreground mt-1">You are currently <span className="text-success font-medium">Online</span> and ready for trips.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        Go Offline
                    </Button>
                    <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center border border-success/30">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Today's Earnings", value: "$142.50", icon: DollarSign, color: "text-success", bg: "bg-success/20" },
                    { title: "Trips Completed", value: "12", icon: CheckCircle2, color: "text-primary", bg: "bg-primary/20" },
                    { title: "Rating", value: "4.92", icon: Star, color: "text-warning", bg: "bg-warning/20" },
                    { title: "Online Time", value: "6h 15m", icon: Clock, color: "text-accent", bg: "bg-accent/20" },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card border-glass-border">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2 rounded-lg", stat.bg)}>
                                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                                </div>
                                <Badge variant="outline" className="text-[10px]">+12%</Badge>
                            </div>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stat.title}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Active Trip / Next Request */}
                <Card className="lg:col-span-2 glass-card border-glass-border bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            New Trip Request
                        </CardTitle>
                        <Badge className="bg-primary glow-primary">High Demand</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 rounded-xl bg-muted/30 border border-glass-border">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Pickup</div>
                                        <div className="text-sm font-medium text-foreground">Central Station, Zone A</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-destructive" />
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Dropoff</div>
                                        <div className="text-sm font-medium text-foreground">Airport Terminal 2, Zone F</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="text-2xl font-bold text-foreground">$24.80</div>
                                <div className="text-xs text-muted-foreground">Est. 18 mins • 12.4 km</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1">Decline</Button>
                            <Button className="flex-[2] gap-2 glow-primary">
                                Accept Trip
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Driver Map / Zone Info */}
                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Map className="h-5 w-5 text-secondary" />
                            Heatmap
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="aspect-square rounded-xl bg-muted/30 border border-dashed border-muted-foreground/30 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
                            <div className="text-center z-10">
                                <Navigation className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">Interactive Map View</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Current Zone</span>
                                <span className="text-foreground font-medium">Zone B (Downtown)</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Demand Level</span>
                                <Badge variant="outline" className="text-success border-success/30">High</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Trips */}
            <Card className="glass-card border-glass-border">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Trips</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { id: "#TR-9021", time: "10:45 AM", amount: "$12.50", status: "Completed" },
                            { id: "#TR-9018", time: "09:30 AM", amount: "$18.20", status: "Completed" },
                            { id: "#TR-9015", time: "08:15 AM", amount: "$9.40", status: "Completed" },
                        ].map((trip, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-muted">
                                        <Car className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-foreground">{trip.id}</div>
                                        <div className="text-xs text-muted-foreground">{trip.time}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-foreground">{trip.amount}</div>
                                    <div className="text-[10px] text-success font-medium">{trip.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
