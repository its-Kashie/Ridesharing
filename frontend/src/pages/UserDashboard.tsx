import {
    MapPin,
    Navigation,
    Clock,
    History,
    Star,
    CreditCard,
    Search,
    Zap,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import InteractiveMap from "@/components/InteractiveMap";

export default function UserDashboard() {
    return (
        <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Welcome back, Alex!</h1>
                    <p className="text-muted-foreground mt-1">Where would you like to go today?</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-foreground">RidePoints</div>
                        <div className="text-xs text-primary font-bold">1,250 pts</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Star className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </div>

            {/* Quick Booking */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass-card border-glass-border overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Navigation className="h-5 w-5 text-primary" />
                            Book a Ride
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                        <Input
                                            placeholder="Enter pickup location"
                                            className="pl-10 bg-muted/30 border-glass-border focus:border-primary"
                                            defaultValue="Home (123 Maple St)"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-destructive" />
                                        <Input
                                            placeholder="Enter destination"
                                            className="pl-10 bg-muted/30 border-glass-border focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Economy", "Comfort", "Premium", "Electric"].map((type) => (
                                        <button
                                            key={type}
                                            className={cn(
                                                "p-3 rounded-xl border border-glass-border transition-all hover:border-primary/50 text-center",
                                                type === "Economy" ? "bg-primary/10 border-primary/50" : "bg-muted/20"
                                            )}
                                        >
                                            <div className="text-xs font-medium text-muted-foreground mb-1">{type}</div>
                                            <div className="text-sm font-bold text-foreground">$12.50</div>
                                        </button>
                                    ))}
                                </div>
                                <Button className="w-full gap-2 glow-primary" size="lg">
                                    Confirm Booking
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="h-[300px] md:h-auto min-h-[300px]">
                                <InteractiveMap />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-secondary" />
                            Recent Destinations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Work Office", address: "456 Business Ave", icon: Zap },
                            { name: "Central Mall", address: "789 Retail Rd", icon: MapPin },
                            { name: "Gym", address: "101 Fitness Way", icon: MapPin },
                        ].map((loc, i) => (
                            <button
                                key={i}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                            >
                                <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                                    <loc.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-foreground truncate">{loc.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{loc.address}</div>
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Active Trip / Status */}
                <Card className="glass-card border-glass-border bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center animate-pulse">
                                <Search className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-foreground">Searching for Driver</div>
                                <div className="text-sm text-muted-foreground">ETA: 4-6 mins</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                                <CreditCard className="h-5 w-5 text-foreground" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-foreground">Visa •••• 4242</div>
                                <div className="text-xs text-muted-foreground">Expires 12/25</div>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary">Default</Badge>
                    </CardContent>
                </Card>

                {/* History Preview */}
                <Card className="glass-card border-glass-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Last Trip</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold text-foreground">$18.40</div>
                        <div className="text-xs text-muted-foreground mt-1">Yesterday, 6:45 PM to Downtown</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
