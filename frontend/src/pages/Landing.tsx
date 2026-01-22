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
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

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
      <Navbar />

      {/* Floating Graph Nodes Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50">
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
        <div className="container mx-auto px-6 pt-40 pb-20">

          {/* Hero Content */}
          <div className="text-center max-w-5xl mx-auto mb-32">
            <div className={cn(
              "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8 transition-all duration-700",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium tracking-wide uppercase">Engineering Modern Logistics</span>
            </div>

            <h1 className={cn(
              "text-6xl md:text-8xl font-bold mb-8 transition-all duration-1000 delay-100 tracking-tight",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <span className="text-foreground">Next-Gen</span>
              <br />
              <span className="text-gradient-primary">Mobility OS</span>
            </h1>

            <p className={cn(
              "text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-200 leading-relaxed",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              RideFlow is an advanced dispatch intelligence platform.
              Built on graph theory and real-time optimization algorithms to power the future of urban mobility.
            </p>

            <div className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 delay-300",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Link to="/dashboard">
                <Button size="lg" className="h-16 gap-3 text-xl px-10 glow-primary rounded-2xl group">
                  Get Started
                  <Play className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="h-16 gap-3 text-xl px-10 border-white/10 hover:bg-white/5 rounded-2xl">
                  Learn More
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className={cn(
            "glass-card p-10 mb-32 transition-all duration-1000 delay-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">20ms</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Avg Latency</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Path Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">320+</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Active Nodes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-success mb-2">Zero</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest">State Conflicts</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className={cn(
                "text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 delay-[600ms]",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                Built for <span className="text-gradient-secondary">Precision</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our platform leverages cutting-edge data structures to solve the complex
                traveling salesman problem at scale.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={cn(
                      "glass-card-hover p-8 group transition-all duration-700",
                      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <div className={cn(
                      "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 bg-gradient-to-br transition-transform group-hover:scale-110",
                      feature.gradient
                    )}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className={cn(
            "text-center transition-all duration-1000 delay-[1500ms]",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <div className="glass-card p-16 max-w-4xl mx-auto border-primary/20 bg-primary/5">
              <h3 className="text-4xl font-bold mb-6">Revolutionize Your Dispatch</h3>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Experience the power of algorithmic transit management.
                Whether you're a driver or an admin, RideFlow provides the tools you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="h-14 gap-2 px-8 glow-primary rounded-xl text-lg">
                    Enter Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-14 gap-2 px-8 rounded-xl text-lg border-white/10">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-32 pt-12 border-t border-border/50 text-center">
            <div className="flex justify-center gap-8 mb-8 pb-8">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">Docs</Link>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              © 2024 RideFlow Dispatch System. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold">
              Built with React, TypeScript & C++
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
