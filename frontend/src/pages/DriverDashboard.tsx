import {
    Car,
    Navigation,
    DollarSign,
    Star,
    Clock,
    CheckCircle2,
    AlertCircle,
    Map as MapIcon,
    Zap,
    ArrowRight,
    TrendingUp,
    Shield,
    Signal,
    Wallet,
    MessageSquare,
    ChevronRight,
    Play,
    User,
    Navigation2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { socket } from "@/services/socket";
import { toast } from "sonner";

interface TripRequest {
    passengerId: string;
    passengerName: string;
    pickup: string;
    destination: string;
    timestamp: number;
}

export default function DriverDashboard() {
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(true);
    const [incomingRequest, setIncomingRequest] = useState<TripRequest | null>(null);
    const [activeTrip, setActiveTrip] = useState<TripRequest | null>(null);

    useEffect(() => {
        // Listen for new trip broadcasts in real-time
        socket.on("trip_broadcast", (data: TripRequest) => {
            if (isOnline && !activeTrip) {
                setIncomingRequest(data);
                toast.info(`NEW_DISPATCH_REQ: ${data.passengerName}`, {
                    description: `Pickup from ${data.pickup}`,
                    icon: <Zap className="h-5 w-5 text-primary" />
                });
            }
        });

        // Listen for when a trip is confirmed by the passenger
        socket.on("trip_confirmed", (data: any) => {
            // If we were the one accepted (in a real system we'd check driverId)
            // for now we clear the request if it's taken
            if (incomingRequest && incomingRequest.passengerId === data.passengerId) {
                if (data.driverName !== user?.name && !activeTrip) {
                    setIncomingRequest(null);
                    toast.info(`NETWORK: Trip #${data.tripId} taken by another fleet unit.`);
                }
            }
        });

        socket.on("trip_finished", (data: any) => {
            if (activeTrip && activeTrip.passengerId === data.passengerId) {
                setActiveTrip(null);
                toast.success("MISSION_COMPLETE", {
                    description: "Passenger delivered. Awaiting next dispatch signal.",
                    icon: <CheckCircle2 className="h-4 w-4" />
                });
            }
        });

        return () => {
            socket.off("trip_broadcast");
            socket.off("trip_confirmed");
            socket.off("trip_finished");
        };
    }, [isOnline, activeTrip, incomingRequest, user?.name]);

    const handleAccept = () => {
        if (!incomingRequest) return;

        const tripData = {
            ...incomingRequest,
            driverId: user?.id,
            driverName: user?.name,
            carModel: "Tesla Model 3",
            carPlate: "RIDO-777",
            tripId: `TRP-${Math.floor(Math.random() * 9000) + 1000}`,
            price: 12.50
        };

        // Notify the passenger back via socket
        socket.emit("accept_trip", tripData);

        setActiveTrip(incomingRequest);
        setIncomingRequest(null);
        toast.success("MISSION_ACCEPTED: Navigation sequence updated.");
    };

    const toggleStatus = () => {
        setIsOnline(!isOnline);
        if (isOnline) setIncomingRequest(null);
        toast.info(isOnline ? "OPERATOR_OFFLINE" : "OPERATOR_ONLINE");
    };

    const stats = [
        { title: "Net Revenue", value: "$4,240.20", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10", trend: "+12.4%" },
        { title: "Acceptance", value: "98.2%", icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-400/10", trend: "+2.1%" },
        { title: "Rating", value: "4.98", icon: Star, color: "text-amber-400", bg: "bg-amber-400/10", trend: "0.05" },
        { title: "Grid Time", value: "142h", icon: Clock, color: "text-purple-400", bg: "bg-purple-400/10", trend: "+8h" },
    ];

    return (
        <div className="h-screen bg-white text-slate-900 p-6 lg:p-10 flex flex-col space-y-8 animate-fade-in max-w-screen-2xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-100 pb-8 shrink-0">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-3xl bg-gray-50 border border-gray-200 flex items-center justify-center text-primary font-black text-3xl italic shadow-sm">{user?.name.charAt(0)}</div>
                        <div className={cn("absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white shadow-sm", isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">{user?.name.split(' ')[0]} <span className="text-primary">DRIVE</span></h1>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] items-center gap-2 flex mt-1"><Shield className="h-3 w-3 text-primary" /> Verified Operator • Rido Fleet v2.1</p>
                    </div>
                </motion.div>

                <div className="flex items-center gap-4">
                    <Button onClick={toggleStatus} className={cn("h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-sm transition-all", isOnline ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white" : "bg-emerald-500 text-white")}>{isOnline ? "GO_OFFLINE" : "GO_ONLINE"}</Button>
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-primary"><Zap className="h-6 w-6" /></div>
                </div>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-2">
                {/* Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border-gray-100 bg-white hover:bg-gray-50 transition-all relative overflow-hidden group shadow-sm rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className={cn("p-3 rounded-2xl", stat.bg.replace('10', '20'))}><stat.icon className={cn("h-5 w-5", stat.color.replace('400', '600'))} /></div>
                                <Badge variant="outline" className="font-black text-[9px] border-gray-100 text-slate-400">{stat.trend}</Badge>
                            </div>
                            <div className="text-3xl font-black italic text-slate-900 tracking-tighter mb-2">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.title}</div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode="wait">
                            {activeTrip ? (
                                <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}>
                                    <Card className="border-emerald-100 bg-emerald-50/30 p-8 flex flex-col gap-10 overflow-hidden relative rounded-[2.5rem] shadow-sm">
                                        <div className="absolute top-0 right-0 p-6"><Badge className="bg-emerald-500 text-white font-black text-[9px] uppercase px-4 py-1.5 animate-pulse shadow-md shadow-emerald-200">MISSION_IN_PROGRESS</Badge></div>
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-2xl italic">{activeTrip.passengerName.charAt(0)}</div>
                                            <div>
                                                <h3 className="text-3xl font-black italic text-slate-900 uppercase">{activeTrip.passengerName}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Tracking passenger signal...</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-10 border-y border-emerald-100/50 py-10">
                                            <div className="space-y-6 relative">
                                                <div className="absolute left-1 top-2 bottom-2 w-[1px] bg-gray-200 border-dashed border-l" />
                                                <div className="flex items-center gap-4 pl-6 relative">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute left-0" />
                                                    <span className="text-sm font-black italic text-slate-700 uppercase">{activeTrip.pickup}</span>
                                                </div>
                                                <div className="flex items-center gap-4 pl-6 relative">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500 absolute left-0" />
                                                    <span className="text-sm font-black italic text-slate-700 uppercase">{activeTrip.destination}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target_Yield</p>
                                                <p className="text-4xl font-black italic text-emerald-600 tracking-tighter">$12.50</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button className="flex-1 h-16 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200">COMPLETE_MISSION</Button>
                                            <Button variant="ghost" onClick={() => setActiveTrip(null)} className="h-16 px-8 rounded-2xl border border-gray-100 text-rose-500 font-black uppercase text-xs hover:bg-rose-50">ABORT</Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : incomingRequest ? (
                                <motion.div key="request" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
                                    <Card className="border-primary/10 bg-white p-8 flex flex-col gap-10 overflow-hidden relative shadow-lg rounded-[2.5rem]">
                                        <div className="absolute top-0 right-0 p-6"><Badge className="bg-primary text-white font-black text-[9px] uppercase px-4 py-1.5 animate-pulse shadow-md">INCOMING_SIGNAL</Badge></div>
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl italic">{incomingRequest.passengerName.charAt(0)}</div>
                                            <div>
                                                <h3 className="text-3xl font-black italic text-slate-900 uppercase">{incomingRequest.passengerName}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Passenger requesting dispatch</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-10 border-y border-gray-100 py-10">
                                            <div className="space-y-6 relative">
                                                <div className="absolute left-1 top-2 bottom-2 w-[1px] bg-gray-100 border-dashed border-l" />
                                                <div className="flex items-center gap-4 pl-6 relative">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute left-0 shadow-sm" />
                                                    <span className="text-sm font-black italic text-slate-700 uppercase">{incomingRequest.pickup}</span>
                                                </div>
                                                <div className="flex items-center gap-4 pl-6 relative">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500 absolute left-0 shadow-sm" />
                                                    <span className="text-sm font-black italic text-slate-700 uppercase">{incomingRequest.destination}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col justify-center">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated_Yield</p>
                                                <p className="text-5xl font-black italic text-slate-900 tracking-tighter leading-none">$12.50</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button variant="outline" onClick={() => setIncomingRequest(null)} className="flex-1 h-16 rounded-2xl border-gray-100 bg-gray-50 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 hover:text-rose-500">DECLINE</Button>
                                            <Button onClick={handleAccept} className="flex-[2] h-16 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-[1.02]">INITIALIZE_TRIP</Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                                    <Signal className="h-12 w-12 text-gray-200 mb-6 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic text-center px-8 leading-relaxed">Scanning Frequency for Dispatch signals...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <Card className="border-gray-100 bg-white p-0 overflow-hidden relative shadow-sm rounded-3xl">
                            <CardHeader className="p-8 border-b border-gray-50"><CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic flex items-center gap-3"><MapIcon className="h-4 w-4" />Grid_Positioning</CardTitle></CardHeader>
                            <div className="h-64 bg-gray-50/50 flex items-center justify-center relative group">
                                <TrendingUp className="h-24 w-24 text-gray-100 group-hover:scale-110 transition-transform" />
                                <div className="absolute flex flex-col items-center"><div className="h-4 w-4 rounded-full bg-primary animate-ping" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4">Node 7 Active</span></div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest"><span>Cluster_Density</span><span className="text-emerald-500">Stable</span></div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shrink-0"><motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-emerald-500 shadow-sm" /></div>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="ghost" className="flex-1 h-12 bg-gray-50 border border-gray-100 text-slate-500 font-black uppercase text-[9px] tracking-widest hover:text-primary">Heatmap</Button>
                                    <Button variant="ghost" className="h-12 w-12 bg-gray-50 border border-gray-100 text-primary hover:bg-gray-100"><Navigation className="h-5 w-5" /></Button>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-amber-100 bg-amber-50/50 p-8 shadow-sm relative group overflow-hidden rounded-3xl">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-amber-200" />
                            <div className="flex justify-between items-start mb-6">
                                <div><p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 italic">Weekly Performance</p><p className="text-2xl font-black italic text-slate-900">$4,240 / $5,000</p></div>
                                <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm"><TrendingUp className="h-5 w-5" /></div>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-amber-500" /></div>
                            <p className="text-[9px] font-black text-amber-600/40 uppercase tracking-[0.3em] mt-6 text-center italic">Advanced Tier 3 Bonus at $5,000</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
