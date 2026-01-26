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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 transition-colors">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium tracking-wide uppercase">RideFlow v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
            Next-Gen <span className="text-primary">Mobility</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A simple, powerful dispatch intelligence platform.
            Optimize your logistics with our real-time graph algorithms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/login">
              <Button size="lg" className="h-14 px-8 text-lg rounded-xl shadow-sm hover:shadow-md transition-all">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white rounded-xl shadow-sm hover:bg-gray-50 border-gray-200">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 w-full max-w-6xl grid md:grid-cols-3 gap-8 text-left">
          {/* Simple Feature Cards */}
          {[
            { icon: Map, title: "City Graph", desc: "Interactive visualization of city zones." },
            { icon: Zap, title: "Smart Dispatch", desc: "Efficient algorithm-based assignment." },
            { icon: BarChart3, title: "Real-time Analytics", desc: "Live metrics and system insights." }
          ].map((f, i) => (
            <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <f.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200 mt-auto bg-white">
        © 2024 RideFlow. Built for simplicity.
      </footer>
    </div>
  );
}
