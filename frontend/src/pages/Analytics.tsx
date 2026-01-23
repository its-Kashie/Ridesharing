import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from "recharts";
import {
    TrendingUp,
    Users,
    Clock,
    Map,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

const TRIP_DATA = [
    { name: "Mon", trips: 400, revenue: 2400 },
    { name: "Tue", trips: 300, revenue: 1398 },
    { name: "Wed", trips: 200, revenue: 9800 },
    { name: "Thu", trips: 278, revenue: 3908 },
    { name: "Fri", trips: 189, revenue: 4800 },
    { name: "Sat", trips: 239, revenue: 3800 },
    { name: "Sun", trips: 349, revenue: 4300 },
];

const ZONE_DATA = [
    { name: "Zone A", value: 400 },
    { name: "Zone B", value: 300 },
    { name: "Zone C", value: 300 },
    { name: "Zone D", value: 200 },
];

const COLORS = ["#0EA5E9", "#8B5CF6", "#10B981", "#F59E0B"];

const Analytics = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Comprehensive insights into system performance and trip metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: TrendingUp, trend: "up" },
                    { title: "Active Drivers", value: "142", change: "+12", icon: Users, trend: "up" },
                    { title: "Avg. Trip Time", value: "12.5 min", change: "-2.4%", icon: Clock, trend: "down" },
                    { title: "Total Distance", value: "12,405 km", change: "+18.2%", icon: Map, trend: "up" },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card border-glass-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3 text-success" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                                )}
                                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                                    {stat.change}
                                </span>
                                <span>from last month</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle>Trip Volume vs Revenue</CardTitle>
                        <CardDescription>Weekly performance overview</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TRIP_DATA}>
                                <defs>
                                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                                    itemStyle={{ color: "hsl(var(--foreground))" }}
                                />
                                <Area type="monotone" dataKey="trips" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTrips)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle>Trips per Zone</CardTitle>
                        <CardDescription>Distribution across the city</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ZONE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {ZONE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {ZONE_DATA.map((zone, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-xs text-muted-foreground">{zone.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle>Peak Usage Times</CardTitle>
                        <CardDescription>Hourly trip distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={TRIP_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                                />
                                <Bar dataKey="trips" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass-card border-glass-border">
                    <CardHeader>
                        <CardTitle>Driver Utilization Rate</CardTitle>
                        <CardDescription>Efficiency metrics per shift</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={TRIP_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
