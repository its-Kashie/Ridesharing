import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Terminal,
    Info,
    AlertCircle,
    CheckCircle2,
    Clock,
    Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const LOGS = [
    { time: "15:45:22", level: "INFO", module: "DISPATCH", message: "Optimal path calculated for Trip T-1022 using Dijkstra." },
    { time: "15:44:10", level: "SUCCESS", module: "AUTH", message: "User 'admin_01' logged in successfully." },
    { time: "15:42:05", level: "WARNING", module: "NETWORK", message: "High latency detected in Zone B driver telemetry." },
    { time: "15:40:30", level: "INFO", module: "STATE", message: "Trip T-1019 transitioned from ASSIGNED to ONGOING." },
    { time: "15:38:15", level: "ERROR", module: "DATABASE", message: "Failed to persist rollback state for operation #442." },
    { time: "15:35:00", level: "INFO", module: "SYSTEM", message: "Periodic cleanup of expired session tokens completed." },
    { time: "15:32:45", level: "SUCCESS", module: "TRIP", message: "Trip T-1015 marked as COMPLETED. Revenue: $22.40." },
    { time: "15:30:12", level: "INFO", module: "DISPATCH", message: "Driver D-88 assigned to Trip T-1021." },
    { time: "15:28:55", level: "WARNING", module: "ZONE", message: "Zone A demand multiplier increased to 1.8x." },
    { time: "15:25:20", level: "INFO", module: "STATE", message: "Trip T-1018 transitioned from REQUESTED to ASSIGNED." },
];

const SystemLogs = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                <p className="text-muted-foreground">Real-time audit trail of all system operations and state transitions.</p>
            </div>

            <Card className="glass-card border-glass-border">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-primary" />
                        Live Console
                    </CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter logs..."
                            className="pl-9 bg-background/50 h-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] w-full rounded-md border border-glass-border bg-black/20 p-4 font-mono text-sm">
                        <div className="space-y-2">
                            {LOGS.map((log, i) => (
                                <div key={i} className="flex items-start gap-4 py-1 border-b border-white/5 last:border-0">
                                    <span className="text-muted-foreground whitespace-nowrap">{log.time}</span>
                                    <Badge
                                        variant="outline"
                                        className={`
                      text-[10px] px-1.5 py-0 font-bold
                      ${log.level === "INFO" ? "border-blue-500/50 text-blue-400" : ""}
                      ${log.level === "SUCCESS" ? "border-green-500/50 text-green-400" : ""}
                      ${log.level === "WARNING" ? "border-yellow-500/50 text-yellow-400" : ""}
                      ${log.level === "ERROR" ? "border-red-500/50 text-red-400" : ""}
                    `}
                                    >
                                        {log.level}
                                    </Badge>
                                    <span className="text-primary/80 font-bold whitespace-nowrap">[{log.module}]</span>
                                    <span className="text-foreground/90">{log.message}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-2 pt-2 animate-pulse">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-xs text-muted-foreground">Listening for new events...</span>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
};

export default SystemLogs;
