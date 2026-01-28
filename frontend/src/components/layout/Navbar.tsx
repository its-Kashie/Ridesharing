import { Link, useLocation } from "react-router-dom";
import { Zap, Play, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-6 py-4">
                <nav className="glass-card flex items-center justify-between px-6 py-3 border-white/10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary transition-transform group-hover:scale-110">
                            <Zap className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">Rido</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-foreground p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </nav>
            </div>

            {/* Mobile Nav */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden transition-all duration-300 ease-in-out transform",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={cn(
                                "text-2xl font-bold transition-colors hover:text-primary",
                                location.pathname === link.href ? "text-primary" : "text-foreground"
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-4 w-full mt-8">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full text-lg h-12">
                                Login
                            </Button>
                        </Link>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button className="w-full text-lg h-12 glow-primary">
                                Enter System
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
