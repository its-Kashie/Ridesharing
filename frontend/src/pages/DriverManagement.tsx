import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    MapPin,
    Car,
    Activity,
    Search,
    Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InteractiveMap from "@/components/InteractiveMap";

const MOCK_DRIVERS = [
    { id: "D1", name: "Alex Rivera", status: "Available", location: "Downtown", utilization: 75, trips: 12 },
    { id: "D2", name: "Sarah Chen", status: "Assigned", location: "North District", utilization: 90, trips: 15 },
    { id: "D3", name: "Marcus Johnson", status: "Offline", location: "West End", utilization: 0, trips: 8 },
    { id: "D4", name: "Elena Rodriguez", status: "Available", location: "South Port", utilization: 60, trips: 10 },
    { id: "D5", name: "Kevin Park", status: "Assigned", location: "East Valley", utilization: 85, trips: 14 },
];

const DriverManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDrivers = MOCK_DRIVERS.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
                    <p className="text-muted-foreground">Monitor and manage your fleet of drivers in real-time.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search drivers..."
                            className="pl-9 bg-background/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDrivers.map((driver) => (
                    <Card key={driver.id} className="glass-card-hover border-glass-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">ID: {driver.id}</p>
                                </div>
                            </div>
                            <Badge className={
                                driver.status === "Available" ? "status-available" :
                                    driver.status === "Assigned" ? "status-assigned" : "status-offline"
                            }>
                                {driver.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 py-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> Location
                                    </p>
                                    <p className="text-sm font-medium">{driver.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Car className="h-3 w-3" /> Total Trips
                                    </p>
                                    <p className="text-sm font-medium">{driver.trips}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Activity className="h-3 w-3" /> Utilization
                                    </span>
                                    <span className="font-medium">{driver.utilization}%</span>
                                </div>
                                <Progress value={driver.utilization} className="h-1.5" />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="w-full">View Details</Button>
                                <Button variant="outline" size="sm" className="w-full">Track Live</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="glass-card border-glass-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Driver Distribution (Mini-Map)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-glass-border">
                        <InteractiveMap />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DriverManagement;
