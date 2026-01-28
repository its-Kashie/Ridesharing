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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold tracking-tight text-foreground block">Rido</span>
            </div>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Enter your details to access your account" : "Get started with Rido today"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="pl-10 h-10 rounded-lg bg-background/50 border-input"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="pl-10 h-10 rounded-lg bg-background/50 border-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {isLogin && <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-10 rounded-lg bg-background/50 border-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <Label className="block text-sm font-medium">I am a...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id as UserRole)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200",
                        selectedRole === r.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background/30 text-muted-foreground hover:bg-background/50"
                      )}
                    >
                      <r.icon className="h-5 w-5" />
                      <div className="text-xs font-medium">{r.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick Demo Access */}
          {isLogin && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Quick Demo Login</p>
              <div className="flex gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => fillDemo(r.id as UserRole)}
                    className="flex-1 px-2 py-1.5 rounded-md bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 text-xs font-medium text-secondary-foreground transition-colors"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-medium text-primary hover:underline">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
