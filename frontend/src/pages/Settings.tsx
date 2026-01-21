import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
    Settings as SettingsIcon,
    Moon,
    Sun,
    Zap,
    Shield,
    Bell,
    Save,
    Palette
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";

const Settings = () => {
    const handleSave = () => {
        toast.success("Settings saved successfully", {
            description: "System configuration has been updated.",
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure system parameters, theme preferences, and simulation speed.</p>
            </div>

            <div className="grid gap-6">
                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            Appearance
                        </CardTitle>
                        <CardDescription>Customize how the dashboard looks for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Interface Theme</Label>
                                <p className="text-xs text-muted-foreground">Switch between light and dark modes.</p>
                            </div>
                            <ModeToggle />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Glassmorphism Effects</Label>
                                <p className="text-xs text-muted-foreground">Enable frosted glass and blur effects.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-secondary" />
                            Simulation Tuning
                        </CardTitle>
                        <CardDescription>Adjust algorithm weights and simulation parameters.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Zone Penalty Multiplier</Label>
                                <span className="text-xs font-mono">1.5x</span>
                            </div>
                            <Slider defaultValue={[1.5]} max={3} step={0.1} />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Simulation Speed</Label>
                                <span className="text-xs font-mono">2.0x</span>
                            </div>
                            <Slider defaultValue={[2.0]} max={5} step={0.5} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Auto-Dispatch</Label>
                                <p className="text-xs text-muted-foreground">Automatically assign drivers to high-priority requests.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-accent" />
                            Security & Access
                        </CardTitle>
                        <CardDescription>Manage system permissions and audit logs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Rollback Protection</Label>
                                <p className="text-xs text-muted-foreground">Require confirmation for bulk state rollbacks.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Detailed Logging</Label>
                                <p className="text-xs text-muted-foreground">Capture verbose telemetry for all dispatch operations.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
