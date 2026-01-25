import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, Car, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const roles = [
    { id: "admin", label: "Admin", icon: ShieldCheck, description: "System Control" },
    { id: "driver", label: "Driver", icon: Car, description: "Fleet Access" },
    { id: "user", label: "Passenger", icon: Users, description: "Ride Booking" },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials. Try demo accounts!");
      }
    } else {
      const success = await signup(formData.name, formData.email, formData.password, selectedRole);
      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Email already exists");
      }
    }
  };

  const fillDemo = (role: UserRole) => {
    setFormData({
      name: "",
      email: `${role}@demo.com`,
      password: `${role}123`,
    });
    setSelectedRole(role);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#05060f]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-4 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_30px_-5px_hsla(var(--primary),0.6)]"
            >
              <Zap className="h-8 w-8 text-white fill-white" />
            </motion.div>
            <div className="text-left">
              <span className="text-3xl font-black tracking-tighter text-white block leading-none">RIDEFLOW</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Next-Gen Mobility</span>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome back" : "Get started"}
            </h1>
            <p className="text-white/50 text-sm">
              {isLogin ? "Enter your core credentials to initialize session" : "Register your identity on the RideFlow network"}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="name" className="text-xs font-semibold text-white/70 uppercase tracking-wider">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Identified Navigator"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-white/70 uppercase tracking-wider">Email Protocol</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nexus@rideflow.network"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold text-white/70 uppercase tracking-wider">Security Key</Label>
                {isLogin && <button type="button" className="text-[10px] text-primary/80 hover:text-primary transition-colors font-bold uppercase tracking-widest">Lost Key?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-white/70 uppercase tracking-wider text-center block">Access Tier</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id as UserRole)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300",
                        selectedRole === r.id
                          ? "border-primary bg-primary/20 text-white shadow-[0_0_15px_-5px_hsla(var(--primary),0.5)]"
                          : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <r.icon className={cn("h-5 w-5", selectedRole === r.id ? "text-primary" : "text-white/20")} />
                      <div className="text-[10px] font-bold uppercase tracking-tighter">{r.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold shadow-xl shadow-primary/20 border-none transition-all group"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "INITIALIZE SESSION" : "CREATE IDENTITY"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick Demo Access */}
          {isLogin && (
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-center mb-4 text-center">Quick Access Demo Nodes</p>
              <div className="flex gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => fillDemo(r.id as UserRole)}
                    className="flex-1 px-2 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 text-[9px] font-bold text-white/40 hover:text-primary transition-all uppercase tracking-tighter"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-white/40 hover:text-primary transition-colors group"
            >
              {isLogin ? "New to the network? " : "Already registered? "}
              <span className="font-bold text-primary group-hover:underline decoration-2 underline-offset-4">
                {isLogin ? "Register Node" : "Sign In"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/20 mt-8 font-bold tracking-[0.3em] uppercase">
          Autonomous Mobility OS • v4.2.0 • Real-time Active
        </p>
      </motion.div>
    </div>
  );
}
