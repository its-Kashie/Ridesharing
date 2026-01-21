import { useState } from "react";
import { 
  GitBranch, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TripState = "REQUESTED" | "ASSIGNED" | "ONGOING" | "COMPLETED" | "CANCELLED";

interface StateNode {
  id: TripState;
  label: string;
  description: string;
  x: number;
  y: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Transition {
  from: TripState;
  to: TripState;
  label: string;
  valid: boolean;
}

const states: StateNode[] = [
  { id: "REQUESTED", label: "Requested", description: "Trip request received", x: 150, y: 200, color: "primary", icon: Clock },
  { id: "ASSIGNED", label: "Assigned", description: "Driver assigned to trip", x: 350, y: 200, color: "warning", icon: GitBranch },
  { id: "ONGOING", label: "Ongoing", description: "Trip in progress", x: 550, y: 200, color: "info", icon: Play },
  { id: "COMPLETED", label: "Completed", description: "Trip finished successfully", x: 450, y: 400, color: "success", icon: CheckCircle },
  { id: "CANCELLED", label: "Cancelled", description: "Trip was cancelled", x: 250, y: 400, color: "destructive", icon: XCircle },
];

const transitions: Transition[] = [
  { from: "REQUESTED", to: "ASSIGNED", label: "Assign Driver", valid: true },
  { from: "REQUESTED", to: "CANCELLED", label: "Cancel", valid: true },
  { from: "ASSIGNED", to: "ONGOING", label: "Start Trip", valid: true },
  { from: "ASSIGNED", to: "CANCELLED", label: "Cancel", valid: true },
  { from: "ONGOING", to: "COMPLETED", label: "Complete", valid: true },
  { from: "ONGOING", to: "CANCELLED", label: "Cancel", valid: true },
  // Invalid transitions
  { from: "COMPLETED", to: "REQUESTED", label: "Invalid", valid: false },
  { from: "CANCELLED", to: "ONGOING", label: "Invalid", valid: false },
  { from: "REQUESTED", to: "ONGOING", label: "Skip Assign", valid: false },
  { from: "REQUESTED", to: "COMPLETED", label: "Skip All", valid: false },
];

interface TransitionLog {
  from: TripState;
  to: TripState;
  timestamp: string;
  success: boolean;
}

export default function StateMachine() {
  const [currentState, setCurrentState] = useState<TripState>("REQUESTED");
  const [transitionHistory, setTransitionHistory] = useState<TransitionLog[]>([]);
  const [highlightedTransition, setHighlightedTransition] = useState<string | null>(null);
  const [showInvalid, setShowInvalid] = useState(true);

  const validTransitions = transitions.filter(t => t.from === currentState && t.valid);
  const invalidTransitions = transitions.filter(t => t.from === currentState && !t.valid);

  const handleTransition = (to: TripState, valid: boolean) => {
    const timestamp = new Date().toLocaleTimeString();
    
    if (valid) {
      setTransitionHistory(prev => [...prev, {
        from: currentState,
        to,
        timestamp,
        success: true,
      }]);
      setCurrentState(to);
    } else {
      setTransitionHistory(prev => [...prev, {
        from: currentState,
        to,
        timestamp,
        success: false,
      }]);
    }
  };

  const reset = () => {
    setCurrentState("REQUESTED");
    setTransitionHistory([]);
  };

  const getStateColor = (state: StateNode) => {
    const colors: Record<string, string> = {
      primary: "bg-primary/20 border-primary text-primary",
      warning: "bg-warning/20 border-warning text-warning",
      info: "bg-info/20 border-info text-info",
      success: "bg-success/20 border-success text-success",
      destructive: "bg-destructive/20 border-destructive text-destructive",
    };
    return colors[state.color] || colors.primary;
  };

  const getTransitionPath = (from: StateNode, to: StateNode): string => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const curve = 50;
    
    if (Math.abs(dy) < 50) {
      // Horizontal transition
      return `M ${from.x + 60} ${from.y} C ${from.x + 60 + curve} ${from.y}, ${to.x - 60 - curve} ${to.y}, ${to.x - 60} ${to.y}`;
    } else {
      // Vertical/diagonal transition
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      return `M ${from.x} ${from.y + 40} Q ${midX} ${midY + 30}, ${to.x} ${to.y - 40}`;
    }
  };

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trip State Machine</h1>
          <p className="text-muted-foreground mt-1">Interactive visualization of trip lifecycle transitions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInvalid(!showInvalid)}
            className={cn(!showInvalid && "opacity-50")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {showInvalid ? "Hide" : "Show"} Invalid
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* State Diagram */}
        <div className="flex-1 glass-card overflow-hidden relative">
          <svg className="w-full h-full" viewBox="0 0 700 500">
            <defs>
              <marker id="arrow-valid" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--success))" />
              </marker>
              <marker id="arrow-invalid" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--destructive))" />
              </marker>
              <marker id="arrow-default" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
              </marker>
            </defs>

            {/* Transition arrows */}
            {transitions
              .filter(t => t.valid || showInvalid)
              .map((transition, i) => {
                const fromState = states.find(s => s.id === transition.from);
                const toState = states.find(s => s.id === transition.to);
                if (!fromState || !toState) return null;

                const isActive = currentState === transition.from;
                const isHighlighted = highlightedTransition === `${transition.from}-${transition.to}`;

                return (
                  <g
                    key={i}
                    className="cursor-pointer transition-opacity"
                    style={{ opacity: isActive ? 1 : 0.3 }}
                    onMouseEnter={() => setHighlightedTransition(`${transition.from}-${transition.to}`)}
                    onMouseLeave={() => setHighlightedTransition(null)}
                    onClick={() => isActive && handleTransition(transition.to, transition.valid)}
                  >
                    <path
                      d={getTransitionPath(fromState, toState)}
                      fill="none"
                      stroke={transition.valid ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                      strokeWidth={isHighlighted ? 3 : 2}
                      strokeDasharray={transition.valid ? undefined : "5,5"}
                      markerEnd={transition.valid ? "url(#arrow-valid)" : "url(#arrow-invalid)"}
                      className="transition-all duration-200"
                    />
                    {/* Transition label */}
                    {isActive && (
                      <text
                        x={(fromState.x + toState.x) / 2}
                        y={(fromState.y + toState.y) / 2 - 10}
                        textAnchor="middle"
                        className={cn(
                          "text-xs font-medium",
                          transition.valid ? "fill-success" : "fill-destructive"
                        )}
                      >
                        {transition.label}
                      </text>
                    )}
                  </g>
                );
              })}

            {/* State nodes */}
            {states.map((state) => {
              const Icon = state.icon;
              const isCurrent = currentState === state.id;
              const isTerminal = state.id === "COMPLETED" || state.id === "CANCELLED";

              return (
                <g key={state.id} className="transition-all duration-300">
                  {/* Glow effect for current state */}
                  {isCurrent && (
                    <ellipse
                      cx={state.x}
                      cy={state.y}
                      rx="75"
                      ry="50"
                      fill="none"
                      stroke={`hsl(var(--${state.color}))`}
                      strokeWidth="2"
                      className="animate-pulse"
                      style={{ filter: "blur(4px)" }}
                    />
                  )}

                  {/* State shape */}
                  <ellipse
                    cx={state.x}
                    cy={state.y}
                    rx="60"
                    ry="40"
                    className={cn(
                      "transition-all duration-300",
                      isCurrent ? `fill-${state.color}/30` : "fill-muted/30"
                    )}
                    stroke={isCurrent ? `hsl(var(--${state.color}))` : "hsl(var(--border))"}
                    strokeWidth={isCurrent ? 3 : 2}
                  />

                  {/* Terminal state double border */}
                  {isTerminal && (
                    <ellipse
                      cx={state.x}
                      cy={state.y}
                      rx="52"
                      ry="34"
                      fill="none"
                      stroke={isCurrent ? `hsl(var(--${state.color}))` : "hsl(var(--border))"}
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />
                  )}

                  {/* State label */}
                  <text
                    x={state.x}
                    y={state.y + 5}
                    textAnchor="middle"
                    className={cn(
                      "text-sm font-semibold",
                      isCurrent ? `fill-${state.color}` : "fill-foreground"
                    )}
                    fill={isCurrent ? `hsl(var(--${state.color}))` : "hsl(var(--foreground))"}
                  >
                    {state.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Current State Indicator */}
          <div className="absolute top-4 left-4 glass-card px-4 py-2">
            <div className="text-xs text-muted-foreground">Current State</div>
            <div className="text-lg font-bold text-primary">{currentState}</div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-80 flex flex-col gap-4 overflow-auto custom-scrollbar">
          {/* Available Transitions */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              Available Transitions
            </h3>
            {validTransitions.length > 0 ? (
              <div className="space-y-2">
                {validTransitions.map((t, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full justify-start gap-2 border-success/50 hover:bg-success/20 hover:text-success"
                    onClick={() => handleTransition(t.to, true)}
                  >
                    <CheckCircle className="h-4 w-4 text-success" />
                    {t.label}
                    <ArrowRight className="h-3 w-3 ml-auto" />
                    <span className="text-xs opacity-70">{t.to}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No transitions available (terminal state)
              </div>
            )}
          </div>

          {/* Invalid Transitions */}
          {showInvalid && invalidTransitions.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Invalid Transitions
              </h3>
              <div className="space-y-2">
                {invalidTransitions.map((t, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full justify-start gap-2 border-destructive/50 hover:bg-destructive/20 hover:text-destructive opacity-60"
                    onClick={() => handleTransition(t.to, false)}
                  >
                    <XCircle className="h-4 w-4 text-destructive" />
                    {t.label}
                    <ArrowRight className="h-3 w-3 ml-auto" />
                    <span className="text-xs opacity-70">{t.to}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* State Description */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              State Information
            </h3>
            {(() => {
              const state = states.find(s => s.id === currentState);
              if (!state) return null;
              const Icon = state.icon;
              return (
                <div className={cn("p-4 rounded-lg border", getStateColor(state))}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{state.label}</span>
                  </div>
                  <p className="text-sm opacity-80">{state.description}</p>
                </div>
              );
            })()}
          </div>

          {/* Transition History */}
          <div className="glass-card p-4 flex-1">
            <h3 className="font-semibold text-foreground mb-3">Transition History</h3>
            {transitionHistory.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-auto custom-scrollbar">
                {[...transitionHistory].reverse().map((log, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-2 rounded-lg text-sm flex items-center gap-2",
                      log.success ? "bg-success/10" : "bg-destructive/10"
                    )}
                  >
                    {log.success ? (
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-muted-foreground">{log.from}</span>
                      <ArrowRight className="h-3 w-3 inline mx-1" />
                      <span className={log.success ? "text-success" : "text-destructive"}>
                        {log.to}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No transitions yet
              </div>
            )}
          </div>

          {/* DSA Concepts */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3">DSA Concepts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <span className="text-foreground font-medium">Finite State Machine</span>
                  <p className="text-muted-foreground text-xs">Defined set of states and transitions</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0" />
                <div>
                  <span className="text-foreground font-medium">Directed Graph</span>
                  <p className="text-muted-foreground text-xs">States as nodes, transitions as edges</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                <div>
                  <span className="text-foreground font-medium">Terminal States</span>
                  <p className="text-muted-foreground text-xs">COMPLETED & CANCELLED have no outgoing edges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
