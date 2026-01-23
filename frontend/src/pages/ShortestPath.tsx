import { useState, useEffect, useCallback } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  ChevronRight,
  Info,
  Clock,
  Target,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

const nodes: Node[] = [
  { id: "1", label: "Central Hub", x: 400, y: 280 },
  { id: "2", label: "North Station", x: 400, y: 80 },
  { id: "3", label: "East Mall", x: 600, y: 180 },
  { id: "4", label: "South Park", x: 400, y: 480 },
  { id: "5", label: "West Gate", x: 200, y: 180 },
  { id: "6", label: "Airport", x: 650, y: 380 },
  { id: "7", label: "University", x: 150, y: 380 },
  { id: "8", label: "Hospital", x: 300, y: 130 },
];

const edges: Edge[] = [
  { from: "1", to: "2", weight: 8 },
  { from: "1", to: "3", weight: 12 },
  { from: "1", to: "4", weight: 10 },
  { from: "1", to: "5", weight: 9 },
  { from: "2", to: "3", weight: 7 },
  { from: "2", to: "5", weight: 11 },
  { from: "2", to: "8", weight: 5 },
  { from: "3", to: "6", weight: 8 },
  { from: "4", to: "6", weight: 14 },
  { from: "4", to: "7", weight: 13 },
  { from: "5", to: "7", weight: 10 },
  { from: "5", to: "8", weight: 6 },
  { from: "6", to: "4", weight: 14 },
];

interface DijkstraStep {
  currentNode: string;
  visitedNodes: string[];
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  priorityQueue: { node: string; distance: number }[];
  message: string;
}

function runDijkstra(source: string, target: string): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited: Set<string> = new Set();
  const pq: { node: string; distance: number }[] = [];

  // Initialize
  nodes.forEach(node => {
    distances[node.id] = node.id === source ? 0 : Infinity;
    previous[node.id] = null;
  });
  pq.push({ node: source, distance: 0 });

  steps.push({
    currentNode: source,
    visitedNodes: [],
    distances: { ...distances },
    previous: { ...previous },
    priorityQueue: [...pq],
    message: `Initialize: Set distance to source (${source}) as 0, all others as ∞`,
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.distance - b.distance);
    const { node: current } = pq.shift()!;

    if (visited.has(current)) continue;
    visited.add(current);

    steps.push({
      currentNode: current,
      visitedNodes: Array.from(visited),
      distances: { ...distances },
      previous: { ...previous },
      priorityQueue: [...pq],
      message: `Visit node ${current} with distance ${distances[current]}`,
    });

    if (current === target) {
      steps.push({
        currentNode: current,
        visitedNodes: Array.from(visited),
        distances: { ...distances },
        previous: { ...previous },
        priorityQueue: [...pq],
        message: `🎯 Target node ${target} reached! Shortest distance: ${distances[target]}`,
      });
      break;
    }

    // Get neighbors
    const neighbors = edges
      .filter(e => e.from === current || e.to === current)
      .map(e => ({
        node: e.from === current ? e.to : e.from,
        weight: e.weight,
      }));

    for (const { node: neighbor, weight } of neighbors) {
      if (visited.has(neighbor)) continue;

      const newDist = distances[current] + weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        pq.push({ node: neighbor, distance: newDist });

        steps.push({
          currentNode: current,
          visitedNodes: Array.from(visited),
          distances: { ...distances },
          previous: { ...previous },
          priorityQueue: [...pq],
          message: `Update: distance[${neighbor}] = ${newDist} via node ${current}`,
        });
      }
    }
  }

  return steps;
}

function reconstructPath(previous: Record<string, string | null>, target: string): string[] {
  const path: string[] = [];
  let current: string | null = target;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  return path;
}

export default function ShortestPath() {
  const [source, setSource] = useState("1");
  const [target, setTarget] = useState("6");
  const [steps, setSteps] = useState<DijkstraStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [path, setPath] = useState<string[]>([]);

  const runAlgorithm = useCallback(() => {
    const newSteps = runDijkstra(source, target);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    if (newSteps.length > 0) {
      const finalStep = newSteps[newSteps.length - 1];
      setPath(reconstructPath(finalStep.previous, target));
    }
  }, [source, target]);

  useEffect(() => {
    runAlgorithm();
  }, [source, target]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(s => s + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentData = steps[currentStep] || {
    currentNode: source,
    visitedNodes: [],
    distances: {},
    previous: {},
    priorityQueue: [],
    message: "Click Play to start",
  };

  const isComplete = currentStep === steps.length - 1 && steps.length > 0;

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shortest Path Visualization</h1>
          <p className="text-muted-foreground mt-1">Dijkstra's Algorithm step-by-step demonstration</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-success" />
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-36 bg-muted/50">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map(n => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.id}: {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-destructive" />
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="w-36 bg-muted/50">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                {nodes.filter(n => n.id !== source).map(n => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.id}: {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Graph Visualization */}
        <div className="flex-1 glass-card overflow-hidden relative">
          <svg className="w-full h-full">
            <defs>
              <filter id="pathGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isInPath = isComplete && 
                path.includes(edge.from) && 
                path.includes(edge.to) &&
                Math.abs(path.indexOf(edge.from) - path.indexOf(edge.to)) === 1;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={`edge-${i}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isInPath ? "hsl(var(--success))" : "hsl(var(--edge-default))"}
                    strokeWidth={isInPath ? "4" : "2"}
                    strokeOpacity={isInPath ? 1 : 0.5}
                    filter={isInPath ? "url(#pathGlow)" : undefined}
                    className="transition-all duration-300"
                  />
                  <rect
                    x={midX - 12}
                    y={midY - 10}
                    width="24"
                    height="20"
                    rx="4"
                    fill="hsl(var(--background))"
                    fillOpacity="0.9"
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isInPath ? "fill-success" : "fill-muted-foreground"
                    )}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSource = node.id === source;
              const isTarget = node.id === target;
              const isVisited = currentData.visitedNodes.includes(node.id);
              const isCurrent = currentData.currentNode === node.id;
              const isOnPath = isComplete && path.includes(node.id);

              let nodeColor = "fill-muted/50";
              let strokeColor = "hsl(var(--border))";
              let glowClass = "";

              if (isSource) {
                nodeColor = "fill-success/30";
                strokeColor = "hsl(var(--success))";
              } else if (isTarget) {
                nodeColor = "fill-destructive/30";
                strokeColor = "hsl(var(--destructive))";
              } else if (isCurrent) {
                nodeColor = "fill-primary/40";
                strokeColor = "hsl(var(--primary))";
                glowClass = "glow-primary";
              } else if (isOnPath) {
                nodeColor = "fill-success/30";
                strokeColor = "hsl(var(--success))";
              } else if (isVisited) {
                nodeColor = "fill-secondary/30";
                strokeColor = "hsl(var(--secondary))";
              }

              const distance = currentData.distances[node.id];

              return (
                <g key={node.id} className={glowClass}>
                  {/* Pulse animation for current node */}
                  {isCurrent && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="35"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      className="animate-ping"
                      style={{ animationDuration: "1s" }}
                    />
                  )}
                  
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    className={cn("transition-all duration-300", nodeColor)}
                    stroke={strokeColor}
                    strokeWidth="3"
                  />

                  {/* Node ID */}
                  <text
                    x={node.x}
                    y={node.y - 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-foreground"
                  >
                    {node.id}
                  </text>

                  {/* Distance label */}
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    className="text-[10px] fill-muted-foreground font-mono"
                  >
                    {distance === Infinity ? "∞" : distance ?? "∞"}
                  </text>

                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + 52}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {node.label}
                  </text>

                  {/* Source/Target indicators */}
                  {isSource && (
                    <text x={node.x} y={node.y - 45} textAnchor="middle" className="text-xs font-bold fill-success">
                      SOURCE
                    </text>
                  )}
                  {isTarget && (
                    <text x={node.x} y={node.y - 45} textAnchor="middle" className="text-xs font-bold fill-destructive">
                      TARGET
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Control Panel */}
        <div className="w-96 flex flex-col gap-4 overflow-auto custom-scrollbar">
          {/* Playback Controls */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-4">Playback Controls</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-12 w-12 glow-primary"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
                disabled={currentStep >= steps.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Speed
                </span>
                <span className="text-foreground">{(2000 - speed) / 1000 + 0.5}x</span>
              </div>
              <Slider
                value={[2000 - speed]}
                onValueChange={([v]) => setSpeed(2000 - v)}
                min={0}
                max={1500}
                step={100}
              />
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* Current Step Message */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Current Step
            </h3>
            <div className={cn(
              "p-3 rounded-lg text-sm",
              isComplete ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
            )}>
              {currentData.message}
            </div>
          </div>

          {/* Distance Array */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3">Distance Array</h3>
            <div className="grid grid-cols-4 gap-2">
              {nodes.map(node => {
                const dist = currentData.distances[node.id];
                const isSource = node.id === source;
                const isVisited = currentData.visitedNodes.includes(node.id);

                return (
                  <div
                    key={node.id}
                    className={cn(
                      "p-2 rounded-lg text-center border transition-all",
                      isSource ? "bg-success/20 border-success" :
                      isVisited ? "bg-secondary/20 border-secondary" :
                      "bg-muted/50 border-border"
                    )}
                  >
                    <div className="text-xs text-muted-foreground">d[{node.id}]</div>
                    <div className="font-mono font-bold text-foreground">
                      {dist === Infinity ? "∞" : dist ?? "∞"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Queue */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3">Priority Queue</h3>
            {currentData.priorityQueue.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentData.priorityQueue
                  .sort((a, b) => a.distance - b.distance)
                  .map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-3 py-1 rounded-lg text-sm border",
                        i === 0 ? "bg-primary/20 border-primary text-primary" : "bg-muted/50 border-border"
                      )}
                    >
                      {item.node}: {item.distance}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-2">
                {isComplete ? "Queue empty - algorithm complete" : "Queue will populate on start"}
              </div>
            )}
          </div>

          {/* Final Path */}
          {isComplete && (
            <div className="glass-card p-4 animate-scale-in">
              <h3 className="font-semibold text-success mb-3">🎯 Shortest Path Found!</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {path.map((nodeId, i) => (
                  <div key={nodeId} className="flex items-center">
                    <span className="px-3 py-1 rounded-lg bg-success/20 text-success font-medium">
                      {nodeId}
                    </span>
                    {i < path.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-success mx-1" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Total Distance: <span className="text-success font-bold">{currentData.distances[target]}</span>
              </div>
            </div>
          )}

          {/* Algorithm Info */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3">Algorithm Complexity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Complexity</span>
                <span className="font-mono text-accent">O((V + E) log V)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Space Complexity</span>
                <span className="font-mono text-accent">O(V)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Structure</span>
                <span className="text-foreground">Min-Heap / Priority Queue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
