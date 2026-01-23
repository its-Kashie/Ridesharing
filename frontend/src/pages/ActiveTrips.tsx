import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Car,
    MapPin,
    Clock,
    MoreVertical,
    Navigation,
    XCircle,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const MOCK_ACTIVE_TRIPS = [
    {
        id: "T-1001",
        rider: "John Doe",
        driver: "Sarah Chen",
        status: "Ongoing",
        pickup: "Zone A",
        dropoff: "Zone B",
        progress: 65,
        eta: "5 mins"
    },
    {
        id: "T-1002",
        rider: "Alice Smith",
        driver: "Alex Rivera",
        status: "Assigned",
        pickup: "Zone C",
        dropoff: "Zone A",
        progress: 10,
        eta: "12 mins"
    },
    {
        id: "T-1003",
        rider: "Bob Wilson",
        driver: "Elena Rodriguez",
        status: "Ongoing",
        pickup: "Zone B",
        dropoff: "Zone D",
        progress: 40,
        eta: "8 mins"
    },
];

const ActiveTrips = () => {
    const [trips, setTrips] = useState(MOCK_ACTIVE_TRIPS);

    const handleCancel = (id: string) => {
        setTrips(trips.filter(t => t.id !== id));
        toast.error(`Trip ${id} has been cancelled.`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Active Trips</h1>
                    <p className="text-muted-foreground">Monitor all ongoing and assigned trips in real-time.</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                    {trips.length} Live Trips
                </Badge>
            </div>

            <div className="grid gap-6">
                {trips.map((trip) => (
                    <Card key={trip.id} className="glass-card border-glass-border overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 bg-muted/20 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-glass-border">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge className={trip.status === "Ongoing" ? "status-active" : "status-assigned"}>
                                            {trip.status}
                                        </Badge>
                                        <span className="text-xs font-mono text-muted-foreground">{trip.id}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{trip.rider}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Car className="h-3.5 w-3.5" /> {trip.driver}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">ETA: {trip.eta}</span>
                                </div>
                            </div>

                            <CardContent className="flex-1 p-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="relative space-y-8">
                                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-border border-dashed border-l" />

                                        <div className="relative flex items-start gap-4">
                                            <div className="mt-1 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pickup</p>
                                                <p className="font-medium">{trip.pickup}</p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-start gap-4">
                                            <div className="mt-1 h-5 w-5 rounded-full bg-background border-2 border-accent flex items-center justify-center z-10">
                                                <MapPin className="h-3 w-3 text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Dropoff</p>
                                                <p className="font-medium">{trip.dropoff}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Trip Progress</span>
                                                <span className="font-medium">{trip.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000"
                                                    style={{ width: `${trip.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="outline" className="flex-1 gap-2">
                                                <Navigation className="h-4 w-4" /> Track
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleCancel(trip.id)}>
                                                        <XCircle className="mr-2 h-4 w-4" /> Cancel Trip
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ActiveTrips;
