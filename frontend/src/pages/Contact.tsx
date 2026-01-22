import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
    Mail,
    MapPin,
    Phone,
    Send,
    Github,
    Twitter,
    Linkedin,
    MessageSquare,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Contact() {
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            toast.success("Message sent successfully!");
        }, 1500);
    };

    const contactInfo = [
        { icon: Mail, label: "Email", value: "hello@rideflow.io" },
        { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
        { icon: MapPin, label: "Location", value: "Tech Hub, Silicon Valley" },
    ];

    return (
        <div className="min-h-screen gradient-bg gradient-mesh overflow-hidden">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Get in <span className="text-gradient-primary">Touch</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Have questions about our dispatch algorithms or want to collaborate?
                            We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Info Section */}
                        <div className={cn(
                            "space-y-8 transition-all duration-700",
                            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                        )}>
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    <MessageSquare className="text-primary" />
                                    Contact Information
                                </h2>

                                <div className="space-y-6">
                                    {contactInfo.map((info, i) => {
                                        const Icon = info.icon;
                                        return (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-muted-foreground">{info.label}</div>
                                                    <div className="text-lg font-semibold">{info.value}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-12">
                                    <div className="text-sm font-medium text-muted-foreground mb-4">Follow us</div>
                                    <div className="flex gap-4">
                                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                                            <Button key={i} variant="outline" size="icon" className="h-12 w-12 rounded-xl border-white/10 hover:bg-primary/10 hover:border-primary/50 text-foreground">
                                                <Icon size={20} />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 bg-primary/5 border-primary/20">
                                <h3 className="font-bold mb-2">Technical Support</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    For issues related to the C++ backend or graph visualization engine,
                                    please open an issue on our GitHub repository or check the documentation.
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className={cn(
                            "transition-all duration-700 delay-300",
                            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                        )}>
                            <div className="glass-card p-8">
                                {isSent ? (
                                    <div className="text-center py-12 animate-scale-in">
                                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success mb-6">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                                        <p className="text-muted-foreground mb-8">
                                            Thank you for reaching out. Our team will get back to you within 24 hours.
                                        </p>
                                        <Button onClick={() => setIsSent(false)} variant="outline">
                                            Send another message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input id="name" placeholder="John Doe" required className="bg-background/50 border-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input id="email" type="email" placeholder="john@example.com" required className="bg-background/50 border-white/10" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input id="subject" placeholder="General Inquiry" required className="bg-background/50 border-white/10" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us how we can help..."
                                                className="min-h-[150px] bg-background/50 border-white/10"
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg glow-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full mr-2" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-5 w-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
