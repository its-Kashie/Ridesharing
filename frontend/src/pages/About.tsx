import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
    Users,
    Code2,
    BrainCircuit,
    ShieldCheck,
    Database,
    Network
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Algorithms", value: "Dijkstra, BFS, DFS" },
    { label: "Backend", value: "C++ (Httplib)" },
    { label: "Frontend", value: "React + Tailwind" },
    { label: "State Mgmt", value: "TanStack Query" },
];

const team = [
    {
        name: "System Core",
        role: "Graph Engine",
        desc: "Optimized C++ implementation of city graph and pathfinding.",
        icon: Database
    },
    {
        name: "Frontend UI",
        role: "Visual Interface",
        desc: "Interactive React dashboard with real-time state visualization.",
        icon: Code2
    },
    {
        name: "Logic Layer",
        role: "State Machine",
        desc: "Robust trip lifecycle management using finite state machines.",
        icon: BrainCircuit
    }
];

export default function About() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen gradient-bg gradient-mesh overflow-hidden">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-20 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            About <span className="text-gradient-primary">Rido</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Rido is a sophisticated ride-sharing dispatch system designed to demonstrate
                            the power of Data Structures and Algorithms in solving real-world mobility challenges.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
                        <div className={cn(
                            "glass-card p-8 transition-all duration-700",
                            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                        )}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <ShieldCheck className="text-primary" />
                                Our Objective
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To build a resilient, scalable, and highly visual representation of a modern dispatch engine.
                                We focus on path optimization, real-time driver tracking, and fault-tolerant trip management.
                            </p>
                        </div>
                        <div className={cn(
                            "grid grid-cols-2 gap-4 transition-all duration-700 delay-300",
                            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                        )}>
                            {stats.map((stat, i) => (
                                <div key={i} className="glass-card p-4 text-center">
                                    <div className="text-sm text-primary font-bold mb-1">{stat.label}</div>
                                    <div className="text-xs font-medium text-foreground">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Architecture */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">System Architecture</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {team.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={i}
                                        className={cn(
                                            "glass-card-hover p-6 text-center group transition-all duration-700",
                                            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                        )}
                                        style={{ transitionDelay: `${i * 150}ms` }}
                                    >
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                                        <div className="text-xs text-primary font-medium mb-3 uppercase tracking-wider">{item.role}</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* DSA Integration */}
                    <div className={cn(
                        "glass-card p-10 mb-20 relative overflow-hidden transition-all duration-1000 delay-500",
                        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Network size={120} className="text-primary" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">The DSA Edge</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    At its core, RideFlow is a graph-theory application. We treat the city as a weighted
                                    directed graph where nodes are locations and edges are roads with dynamic weights
                                    representing traffic density.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <p className="text-sm"><strong>Dijkstra's Algorithm:</strong> Used for finding the most efficient route from driver to passenger.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                                        <p className="text-sm"><strong>Priority Queues:</strong> Essential for the dispatch engine to manage multiple concurrent requests.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                                        <p className="text-sm"><strong>State Machines:</strong> Guarantees that a trip cannot move to an invalid state (e.g. "Completed" before "Started").</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-success mt-2 flex-shrink-0" />
                                        <p className="text-sm"><strong>Stack Operations:</strong> Powering the multi-level undo/rollback system for admin management.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="pt-8 border-t border-border/50 text-center">
                        <p className="text-sm text-muted-foreground">
                            Built with precision for the DSA Semester Project 2026.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
