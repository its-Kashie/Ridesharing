import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Download,
    Filter,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const MOCK_HISTORY = [
    { id: "T-998", rider: "James Wilson", driver: "Sarah Chen", date: "2024-03-10", status: "Completed", amount: "$24.50", zone: "Zone A" },
    { id: "T-997", rider: "Emma Davis", driver: "Alex Rivera", date: "2024-03-10", status: "Cancelled", amount: "$0.00", zone: "Zone C" },
    { id: "T-996", rider: "Michael Brown", driver: "Kevin Park", date: "2024-03-09", status: "Completed", amount: "$18.20", zone: "Zone B" },
    { id: "T-995", rider: "Sophia Garcia", driver: "Elena Rodriguez", date: "2024-03-09", status: "Completed", amount: "$32.10", zone: "Zone A" },
    { id: "T-994", rider: "William Taylor", driver: "Sarah Chen", date: "2024-03-08", status: "Completed", amount: "$15.75", zone: "Zone D" },
    { id: "T-993", rider: "Olivia Moore", driver: "Alex Rivera", date: "2024-03-08", status: "Completed", amount: "$21.40", zone: "Zone B" },
    { id: "T-992", rider: "Liam Miller", driver: "Kevin Park", date: "2024-03-07", status: "Cancelled", amount: "$0.00", zone: "Zone C" },
    { id: "T-991", rider: "Ava Anderson", driver: "Elena Rodriguez", date: "2024-03-07", status: "Completed", amount: "$28.90", zone: "Zone A" },
];

const TripHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredHistory = MOCK_HISTORY.filter(trip =>
        trip.rider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trip History</h1>
                    <p className="text-muted-foreground">View and export records of all past trip operations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            <Card className="glass-card border-glass-border">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg">All Records</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by ID or rider..."
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
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-glass-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[100px]">Trip ID</TableHead>
                                    <TableHead>Rider</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Zone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHistory.map((trip) => (
                                    <TableRow key={trip.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-mono text-xs">{trip.id}</TableCell>
                                        <TableCell className="font-medium">{trip.rider}</TableCell>
                                        <TableCell>{trip.driver}</TableCell>
                                        <TableCell className="text-muted-foreground">{trip.date}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">{trip.zone}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={trip.status === "Completed" ? "status-available" : "status-offline"}>
                                                {trip.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{trip.amount}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <p className="text-xs text-muted-foreground">
                            Showing {filteredHistory.length} of {MOCK_HISTORY.length} results
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                <Button variant="secondary" size="sm" className="h-8 w-8 p-0">1</Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
                            </div>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TripHistory;
