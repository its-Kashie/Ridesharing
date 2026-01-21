import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Map,
  Route,
  GitBranch,
  RotateCcw,
  BarChart3,
  ArrowRight,
  Play,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Map,
    title: "City Graph Visualization",
    description: "Interactive graph representation of city zones with real-time node manipulation and edge weight display.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Route,
    title: "Dijkstra's Algorithm",
    description: "Step-by-step animated visualization of shortest path computation with priority queue demonstration.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: GitBranch,
    title: "Trip State Machine",
    description: "Visual state diagram showing trip lifecycle with valid/invalid transition management.",
    gradient: "from-accent to-success",
  },
  {
    icon: RotateCcw,
    title: "Rollback Operations",
    description: "Stack-based undo system with before/after state comparison and multi-step rollback support.",
    gradient: "from-warning to-destructive",
  },
  {
    icon: Zap,
    title: "Smart Dispatch Engine",
    description: "Optimal driver assignment using distance calculations and zone penalty algorithms.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive metrics with real-time charts for trip analysis and driver utilization.",
    gradient: "from-success to-accent",
  },
];

const floatingNodes = [
  { x: 10, y: 20, delay: 0 },
  { x: 85, y: 15, delay: 0.5 },
  { x: 75, y: 70, delay: 1 },
  { x: 20, y: 75, delay: 1.5 },
  { x: 50, y: 40, delay: 2 },
];

export default function Landing() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen gradient-bg gradient-mesh overflow-hidden">
      {/* Floating Graph Nodes Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingNodes.map((node, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-4 h-4 rounded-full bg-primary/20 animate-float",
              mounted ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              animationDelay: `${node.delay}s`,
              transition: "opacity 1s ease-out",
              transitionDelay: `${node.delay}s`,
            }}
          >
            <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
          </div>
        ))}
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {mounted && (
            <>
              <line x1="10%" y1="20%" x2="50%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-fade-in" />
              <line x1="50%" y1="40%" x2="85%" y2="15%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-fade-in delay-200" />
              <line x1="50%" y1="40%" x2="75%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-fade-in delay-300" />
              <line x1="50%" y1="40%" x2="20%" y2="75%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-fade-in delay-400" />
            </>
          )}
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-20">
          {/* Header */}
          <header className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">RideDispatch</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Login
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="gap-2 glow-primary">
                  <Play className="h-4 w-4" />
                  Enter System
                </Button>
              </Link>
            </div>
          </header>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6 transition-all duration-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">DSA Semester Project</span>
            </div>

            <h1 className={cn(
              "text-5xl md:text-7xl font-bold mb-6 transition-all duration-700 delay-100",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <span className="text-foreground">Next-Gen</span>
              <br />
              <span className="text-gradient-primary">Mobility OS</span>
            </h1>

            <p className={cn(
              "text-xl text-muted-foreground mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              A unified platform for riders, drivers, and administrators.
              Featuring interactive mapping, Dijkstra's shortest path, and real-time dispatch intelligence.
            </p>

            <div className={cn(
              "flex items-center justify-center gap-4 transition-all duration-700 delay-300",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-lg px-8 glow-primary">
                  Explore Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/shortest-path">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 border-primary/30 hover:bg-primary/10">
                  <Route className="h-5 w-5" />
                  View Algorithms
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className={cn(
            "glass-card p-6 mb-20 transition-all duration-700 delay-400",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">20+</div>
                <div className="text-sm text-muted-foreground">System Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-1">5</div>
                <div className="text-sm text-muted-foreground">DSA Concepts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Interactive</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success mb-1">A+</div>
                <div className="text-sm text-muted-foreground">Viva Ready</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <h2 className={cn(
              "text-3xl font-bold text-center mb-12 transition-all duration-700 delay-500",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <span className="text-foreground">Core </span>
              <span className="text-gradient-secondary">Features</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      "glass-card-hover p-6 group transition-all duration-700",
                      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{ transitionDelay: `${600 + index * 100}ms` }}
                  >
                    <div className={cn(
                      "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br",
                      feature.gradient
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className={cn(
            "text-center transition-all duration-700 delay-[1200ms]",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="glass-card p-10 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready for Your Viva?</h3>
              <p className="text-muted-foreground mb-6">
                This system demonstrates complete understanding of graph algorithms,
                state machines, and stack operations - all key DSA concepts.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 glow-primary">
                  Enter the System
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              DSA Semester Project • Built with React & TypeScript
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
