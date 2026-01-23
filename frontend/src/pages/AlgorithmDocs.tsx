import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpen,
    Code2,
    Zap,
    Layers,
    Info,
    CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AlgorithmDocs = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Algorithm Documentation</h1>
                <p className="text-muted-foreground">Technical deep-dive into the DSA concepts powering RideFlow.</p>
            </div>

            <Tabs defaultValue="dijkstra" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="dijkstra" className="gap-2">
                        <Zap className="h-4 w-4" /> Dijkstra's Algorithm
                    </TabsTrigger>
                    <TabsTrigger value="graphs" className="gap-2">
                        <Layers className="h-4 w-4" /> Graph Theory
                    </TabsTrigger>
                    <TabsTrigger value="states" className="gap-2">
                        <Code2 className="h-4 w-4" /> State Machines
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dijkstra" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2 glass-card border-glass-border">
                            <CardHeader>
                                <CardTitle>Shortest Path Calculation</CardTitle>
                                <CardDescription>How we find the most efficient route for dispatching.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    Dijkstra's algorithm is used to find the shortest paths between nodes in a graph, which may represent, for example, road networks. In RideFlow, we use it to calculate the minimum "cost" (time/distance) from a driver to a rider.
                                </p>
                                <div className="bg-black/30 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                                    <pre className="text-primary-foreground/80">
                                        {`function Dijkstra(Graph, source):
    create vertex set Q
    for each vertex v in Graph:
        dist[v] ← INFINITY
        prev[v] ← UNDEFINED
        add v to Q
    dist[source] ← 0
    
    while Q is not empty:
        u ← vertex in Q with min dist[u]
        remove u from Q
        
        for each neighbor v of u:
            alt ← dist[u] + length(u, v)
            if alt < dist[v]:
                dist[v] ← alt
                prev[v] ← u`}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-glass-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Complexity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Time Complexity</p>
                                    <p className="text-xl font-bold text-primary">O((V + E) log V)</p>
                                    <p className="text-xs text-muted-foreground">Using a Priority Queue (Binary Heap)</p>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-border">
                                    <p className="text-xs text-muted-foreground uppercase font-bold">Space Complexity</p>
                                    <p className="text-xl font-bold text-secondary">O(V)</p>
                                    <p className="text-xs text-muted-foreground">To store distances and predecessors</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="graphs">
                    <Card className="glass-card border-glass-border">
                        <CardHeader>
                            <CardTitle>City Graph Representation</CardTitle>
                            <CardDescription>Modeling urban infrastructure as a mathematical graph.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="font-bold flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" /> Vertices (Nodes)
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Represent key locations, intersections, or pickup/dropoff points. Each node contains metadata like zone ID and current demand level.
                                    </p>
                                    <h4 className="font-bold flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" /> Edges (Links)
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Represent the roads connecting locations. Edges are weighted based on physical distance, traffic conditions, and zone penalties.
                                    </p>
                                </div>
                                <div className="bg-muted/30 rounded-xl border border-dashed border-muted-foreground/30 flex items-center justify-center p-8">
                                    <div className="text-center space-y-2">
                                        <Layers className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                                        <p className="text-xs text-muted-foreground">Adjacency List Visualization</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="states">
                    <Card className="glass-card border-glass-border">
                        <CardHeader>
                            <CardTitle>Trip Lifecycle State Machine</CardTitle>
                            <CardDescription>Ensuring valid state transitions and system consistency.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                {["REQUESTED", "ASSIGNED", "ONGOING", "COMPLETED", "CANCELLED"].map((state, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono">{state}</Badge>
                                        {i < 4 && <span className="text-muted-foreground">→</span>}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground pt-4">
                                The trip lifecycle is managed by a Finite State Machine (FSM). This prevents illegal operations, such as completing a trip that hasn't been assigned or cancelling a trip that is already finished.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AlgorithmDocs;
