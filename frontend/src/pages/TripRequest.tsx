import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Send,
    MapPin,
    User,
    Clock,
    AlertCircle,
    CheckCircle2,
    Info
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";

const TripRequest = () => {
    const [isDispatching, setIsDispatching] = useState(false);

    const handleDispatch = async () => {
        setIsDispatching(true);
        try {
            const riderId = Math.floor(Math.random() * 1000);
            // Mock nodes for now or could be selected from UI
            const res = await api.requestTrip(riderId, 1, 4);

            toast.success("Trip dispatched successfully!", {
                description: `Trip ID: ${res.tripId}. Status: ${res.status}. Driver ID: ${res.driverId}`,
            });
        } catch (error) {
            toast.error("Failed to dispatch trip. Is the backend running?");
            console.error(error);
        } finally {
            setIsDispatching(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Trip Request & Dispatch</h1>
                <p className="text-muted-foreground">Create new trip requests and assign drivers using the dispatch engine.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle>Request Details</CardTitle>
                        <CardDescription>Enter rider and trip information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rider">Rider Name</Label>
                            <div className="relative">
                                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="rider" placeholder="e.g. John Doe" className="pl-9 bg-background/50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pickup">Pickup Zone</Label>
                                <Select defaultValue="zone-a">
                                    <SelectTrigger id="pickup" className="bg-background/50">
                                        <SelectValue placeholder="Select zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="zone-a">Zone A (Downtown)</SelectItem>
                                        <SelectItem value="zone-b">Zone B (North)</SelectItem>
                                        <SelectItem value="zone-c">Zone C (West)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dropoff">Dropoff Zone</Label>
                                <Select defaultValue="zone-b">
                                    <SelectTrigger id="dropoff" className="bg-background/50">
                                        <SelectValue placeholder="Select zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="zone-a">Zone A (Downtown)</SelectItem>
                                        <SelectItem value="zone-b">Zone B (North)</SelectItem>
                                        <SelectItem value="zone-c">Zone C (West)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority Level</Label>
                            <Select defaultValue="standard">
                                <SelectTrigger id="priority" className="bg-background/50">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="premium">Premium (Urgent)</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full mt-4" onClick={handleDispatch} disabled={isDispatching}>
                            {isDispatching ? (
                                <>
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                    Calculating Optimal Route...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Dispatch Trip
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle>Dispatch Engine Analysis</CardTitle>
                        <CardDescription>Real-time driver comparison</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <Info className="h-5 w-5 text-primary mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium">Optimization Strategy</p>
                                    <p className="text-muted-foreground">Using Dijkstra's algorithm with zone penalty weights (Traffic: 1.2x, Weather: 1.0x).</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-medium">Top Candidates</p>
                                {[
                                    { name: "Sarah Chen", dist: "1.2 km", time: "4 min", score: 98 },
                                    { name: "Alex Rivera", dist: "2.5 km", time: "8 min", score: 85 },
                                    { name: "Elena Rodriguez", dist: "3.1 km", time: "11 min", score: 72 },
                                ].map((candidate, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center text-xs font-bold">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{candidate.name}</p>
                                                <p className="text-xs text-muted-foreground">{candidate.dist} • {candidate.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-primary">{candidate.score}%</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Match</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <AlertCircle className="h-3 w-3" />
                                <span>Zone B currently has a 1.5x demand multiplier.</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TripRequest;
