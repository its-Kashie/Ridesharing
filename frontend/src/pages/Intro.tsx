import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap,
  Map,
  Route,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Globe,
  Navigation2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Intro() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <AnimatePresence>
        {showContent && (
          <div className="z-10 container mx-auto px-6 flex flex-col items-center text-center">
            {/* Project Logo/Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-foreground/80">Welcome to Rido Mobility</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-6 italic leading-none"
            >
              THE FUTURE OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
                RIDE DISPATCH
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-medium tracking-wide uppercase leading-relaxed"
            >
              Experience a revolutionary mobility platform powered by <br />
              advanced graph algorithms and real-time intelligence.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button
                onClick={() => navigate('/login')}
                className="h-16 px-10 text-xs font-black uppercase tracking-[0.2em] rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95 group"
              >
                Launch Platform
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Features Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/10 pt-12"
            >
              {[
                { icon: Navigation2, label: "Smart Routing", value: "Dijkstra Optimized" },
                { icon: ShieldCheck, label: "Security", value: "Verified Drivers" },
                { icon: Globe, label: "Coverage", value: "City Wide" },
                { icon: Zap, label: "Speed", value: "Instant Match" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <item.icon className="h-6 w-6 text-primary/40 mb-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">{item.label}</span>
                  <span className="text-[11px] font-bold text-white/80">{item.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">
          Rido Infrastructure &copy; 2026
        </span>
      </motion.div>
    </div>
  );
}
