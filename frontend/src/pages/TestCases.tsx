import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    TestTube2,
    CheckCircle2,
    XCircle,
    Play,
    RefreshCw,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TEST_CASES = [
    { id: "TC-01", name: "Dijkstra Correctness", category: "Algorithm", status: "Passed", time: "12ms" },
    { id: "TC-02", name: "Graph Connectivity", category: "Graph", status: "Passed", time: "5ms" },
    { id: "TC-03", name: "State Transition: Req -> Ass", category: "FSM", status: "Passed", time: "8ms" },
    { id: "TC-04", name: "Illegal Transition: Req -> Comp", category: "FSM", status: "Passed", time: "3ms" },
    { id: "TC-05", name: "Stack Rollback Logic", category: "System", status: "Passed", time: "15ms" },
    { id: "TC-06", name: "Large Graph Performance", category: "Performance", status: "Warning", time: "145ms" },
    { id: "TC-07", name: "Concurrent Dispatching", category: "System", status: "Passed", time: "22ms" },
    { id: "TC-08", name: "Zone Penalty Weighting", category: "Algorithm", status: "Passed", time: "10ms" },
];

const TestCases = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Test Cases</h1>
                    <p className="text-muted-foreground">Validation suite for algorithms, state transitions, and system integrity.</p>
                </div>
                <Button className="gap-2">
                    <Play className="h-4 w-4" /> Run All Tests
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Tests", value: "48", color: "text-primary" },
                    { label: "Passed", value: "46", color: "text-success" },
                    { label: "Failed", value: "0", color: "text-destructive" },
                    { label: "Warnings", value: "2", color: "text-warning" },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card border-glass-border">
                        <CardContent className="pt-6">
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="glass-card border-glass-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TestTube2 className="h-5 w-5 text-primary" />
                            Validation Suite
                        </CardTitle>
                        <CardDescription>Automated tests for core DSA components</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {TEST_CASES.map((test) => (
                            <div key={test.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-glass-border hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${test.status === "Passed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                                        }`}>
                                        {test.status === "Passed" ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-muted-foreground">{test.id}</span>
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{test.category}</Badge>
                                        </div>
                                        <p className="text-sm font-medium">{test.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className={test.status === "Passed" ? "status-available" : "status-assigned"}>
                                        {test.status}
                                    </Badge>
                                    <p className="text-[10px] text-muted-foreground mt-1">Exec: {test.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TestCases;
