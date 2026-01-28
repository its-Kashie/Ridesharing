import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Github,
    Linkedin,
    Mail,
    ExternalLink,
    Code2,
    Palette,
    Database,
    Terminal
} from "lucide-react";

const TEAM = [
    {
        name: "Alex Rivera",
        role: "Lead Developer",
        specialty: "Algorithms & FSM",
        bio: "Passionate about graph theory and system architecture.",
        initials: "AR",
        icon: Code2
    },
    {
        name: "Sarah Chen",
        role: "UI/UX Designer",
        specialty: "Glassmorphism & Motion",
        bio: "Creating beautiful, functional interfaces for complex data.",
        initials: "SC",
        icon: Palette
    },
    {
        name: "Marcus Johnson",
        role: "Backend Engineer",
        specialty: "Data Structures",
        bio: "Optimizing database queries and state management.",
        initials: "MJ",
        icon: Database
    },
    {
        name: "Elena Rodriguez",
        role: "QA Engineer",
        specialty: "System Testing",
        bio: "Ensuring reliability through rigorous validation suites.",
        initials: "ER",
        icon: Terminal
    }
];

const Team = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Team & Contributions</h1>
                <p className="text-muted-foreground">
                    The brilliant minds behind the Rido Dispatch System. Each member contributed unique expertise in DSA and modern web development.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {TEAM.map((member, i) => (
                    <Card key={i} className="glass-card-hover border-glass-border overflow-hidden group">
                        <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20" />
                        <CardContent className="relative pt-0 text-center pb-6">
                            <div className="flex justify-center -mt-12 mb-4">
                                <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20">
                                    <AvatarFallback className="bg-muted text-xl font-bold">{member.initials}</AvatarFallback>
                                </Avatar>
                            </div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                            <Badge variant="secondary" className="mb-4 gap-1">
                                <member.icon className="h-3 w-3" /> {member.specialty}
                            </Badge>
                            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                                {member.bio}
                            </p>
                            <div className="flex justify-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                                    <Github className="h-4 w-4" />
                                </div>
                                <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                                    <Linkedin className="h-4 w-4" />
                                </div>
                                <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                                    <Mail className="h-4 w-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="glass-card border-glass-border">
                <CardHeader>
                    <CardTitle>Project Breakdown</CardTitle>
                    <CardDescription>Task allocation and implementation phases</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[
                            { phase: "Phase 1: Core System", tasks: ["Graph Visualization", "Dijkstra Implementation", "FSM Logic"], progress: 100 },
                            { phase: "Phase 2: Operations", tasks: ["Driver Management", "Dispatch Engine", "Active Trips"], progress: 100 },
                            { phase: "Phase 3: Supporting", tasks: ["Analytics", "Documentation", "Testing"], progress: 85 },
                        ].map((p, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold">{p.phase}</h4>
                                    <span className="text-sm font-medium">{p.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${p.progress}%` }} />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {p.tasks.map((t, j) => (
                                        <Badge key={j} variant="outline" className="text-[10px] font-normal">{t}</Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Team;
