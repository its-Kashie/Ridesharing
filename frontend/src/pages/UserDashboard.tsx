import {
    MapPin,
    Navigation,
    Clock,
    History,
    Star,
    CreditCard,
    Search,
    Zap,
    ArrowRight,
    Map as MapIcon,
    Wallet,
    Bell,
    CheckCircle2,
    XCircle,
    Calendar,
    ChevronRight,
    Car,
    Plus,
    User as UserIcon,
    ShieldCheck,
    Smartphone,
    ThumbsUp,
    Navigation2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import InteractiveMap from "@/components/InteractiveMap";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { socket } from "@/services/socket";
import { toast } from "sonner";

interface Offer {
    id: string;
    driverName: string;
    carModel: string;
    carPlate: string;
    price: number;
    eta: string;
    rating: number;
    driverId: string;
}

export default function UserDashboard() {
    const { user } = useAuth();
    const [rideStatus, setRideStatus] = useState<"idle" | "searching" | "offers" | "confirmed" | "found" | "active">("idle");
    const [pickup, setPickup] = useState("Node 1");
    const [destination, setDestination] = useState("Node 4");
    const [activeTrip, setActiveTrip] = useState<any>(null);
    const [balance, setBalance] = useState(240.50);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [etaSeconds, setEtaSeconds] = useState(120);

    useEffect(() => {
        let timer: any;
        if (rideStatus === "found") {
            timer = setInterval(() => {
                setEtaSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [rideStatus]);

    const formatETA = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        // Listen for trip confirmation from a real driver (or simulation)
        socket.on("trip_confirmed", (data: any) => {
            if (data.passengerId === user?.id) {
                setRideStatus("found");
                setActiveTrip({
                    id: data.tripId,
                    driverName: data.driverName,
                    carModel: data.carModel,
                    carPlate: data.carPlate,
                    eta: "2 min",
                    price: `$${data.price.toFixed(2)}`
                });
                toast.success(`${data.driverName} is on the way!`, {
                    description: "Driver confirmed your request in real-time.",
                    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                });
            }
        });

        socket.on("trip_finished", (data: any) => {
            if (data.passengerId === user?.id) {
                setRideStatus("idle");
                setActiveTrip(null);
                toast.success("TRIP_SUCCESSFUL", {
                    description: `You have arrived at your destination with ${data.driverName}.`,
                    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                });
            }
        });

        return () => {
            socket.off("trip_confirmed");
            socket.off("trip_finished");
        };
    }, [user?.id]);

    const handleRequestRide = async () => {
        if (!pickup || !destination) {
            toast.error("Please select pickup and destination");
            return;
        }

        setRideStatus("searching");

        // Broadcast request to all drivers via Socket
        socket.emit("request_trip", {
            passengerId: user?.id,
            passengerName: user?.name,
            pickup: pickup,
            destination: destination,
            timestamp: Date.now()
        });

        // Simulated API call to find available drivers (AI/Static offers)
        setTimeout(() => {
            const mockOffers: Offer[] = [
                { id: "o1", driverName: "Ahmad Driver", carModel: "Tesla Model 3", carPlate: "RIDO-777", price: 12.50, eta: "3 min", rating: 4.9, driverId: "d1" },
                { id: "o2", driverName: "Sara Driver", carModel: "Honda Civic", carPlate: "FAST-123", price: 18.20, eta: "1 min", rating: 4.8, driverId: "d2" },
                { id: "o3", driverName: "Ali Driver", carModel: "Toyota Prius", carPlate: "ECO-99", price: 10.00, eta: "5 min", rating: 4.7, driverId: "d3" }
            ];
            setOffers(mockOffers);
            setRideStatus("offers");
            toast.info("Nearby drivers found. Select your ride.");
        }, 1500);
    };

    const handleConfirmOffer = (offer: Offer) => {
        setSelectedOffer(offer);
        setRideStatus("confirmed");

        // Simulate real-time acceptance if not using multi-tabs
        // In a real scenario, this would wait for the 'trip_confirmed' socket event
        setTimeout(() => {
            if (rideStatus === "confirmed") {
                socket.emit("accept_trip", {
                    passengerId: user?.id,
                    tripId: `TRP-${Math.floor(Math.random() * 9000) + 1000}`,
                    driverName: offer.driverName,
                    carModel: offer.carModel,
                    carPlate: offer.carPlate,
                    price: offer.price
                });
            }
        }, 1000);
    };

    const cancelRide = async () => {
        setRideStatus("idle");
        setActiveTrip(null);
        setSelectedOffer(null);
        toast.info("Ride cancelled.");
    };

    const handleTopUp = () => {
        setBalance(prev => prev + 50);
        toast.success("Wallet topped up with $50.00!");
    };

    const quickPicks = [
        { name: "Work", location: "Node 1", icon: MapPin },
        { name: "Home", location: "Node 4", icon: MapPin },
        { name: "Airport", location: "Node 16", icon: Car },
    ];

    return (
        <div className="h-screen bg-white text-slate-900 p-4 md:p-8 lg:p-10 animate-fade-in relative overflow-hidden flex flex-col">
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/[0.03] rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto mb-8 relative z-10 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-1 italic uppercase text-slate-900">
                            RIDEPULSE <span className="text-primary">CORE</span>
                        </h1>
                        <div className="flex items-center gap-4">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                <Navigation2 className="h-3 w-3 text-primary" /> SECURE_CONNECTION_ESTABLISHED
                            </p>
                            <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/5 text-[8px] uppercase font-black px-3">ACTIVE</Badge>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="bg-gray-50 px-8 py-4 border border-gray-200 flex items-center gap-8 shadow-sm rounded-3xl">
                            <div className="text-right">
                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">AVAILABLE_CREDITS</div>
                                <div className="text-3xl font-black italic text-slate-900 leading-none">${balance.toFixed(2)}</div>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleTopUp}
                                className="h-12 w-12 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all font-black text-xl"
                            >
                                +
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto relative z-10 flex-1 flex flex-col overflow-hidden">
                <Tabs defaultValue="book" className="flex-1 flex flex-col overflow-hidden space-y-6">
                    <div className="flex justify-center md:justify-start shrink-0">
                        <TabsList className="bg-gray-100 p-1 rounded-2xl border border-gray-200">
                            <TabsTrigger value="book" className="rounded-xl px-12 py-3 font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                                DISPATCH
                            </TabsTrigger>
                            <TabsTrigger value="history" className="rounded-xl px-12 py-3 font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white">
                                ARCHIVE
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="book" className="flex-1 overflow-hidden outline-none m-0">
                        <div className="grid lg:grid-cols-12 gap-8 h-full">
                            {/* Overlay Side */}
                            <motion.div className="lg:col-span-4 relative h-full flex flex-col">
                                <AnimatePresence mode="wait">
                                    {rideStatus === "idle" || rideStatus === "searching" ? (
                                        <motion.div key="form" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="h-full">
                                            <Card className="border-gray-200 bg-white h-full overflow-hidden shadow-sm flex flex-col p-8 gap-8 rounded-[2.5rem]">
                                                <div className="flex items-center gap-4 border-b border-gray-100 pb-6 shrink-0">
                                                    <div className="p-3 bg-primary/10 rounded-xl">
                                                        <Search className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-black uppercase tracking-widest italic text-slate-900">Route Config</h2>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Initialize network scan</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                                    <div className="space-y-4">
                                                        <div className="relative group">
                                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-sm z-20" />
                                                            <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="ORIGIN_NODE" className="pl-12 bg-gray-50 border-gray-200 h-16 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 placeholder:text-slate-300" />
                                                        </div>
                                                        <div className="relative group">
                                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-slate-400 shadow-sm z-20" />
                                                            <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="TARGET_NODE" className="pl-12 bg-gray-50 border-gray-200 h-16 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 placeholder:text-slate-300" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Presets</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {quickPicks.map(p => (
                                                                <Button key={p.name} variant="ghost" onClick={() => setDestination(p.location)} className="bg-gray-50 border border-gray-200 text-[9px] font-black uppercase tracking-widest h-10 px-4 rounded-xl hover:bg-primary/10 hover:text-primary">
                                                                    {p.name}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button onClick={handleRequestRide} disabled={rideStatus === "searching"} className="w-full h-20 shrink-0 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.3em] shadow-lg hover:scale-[1.02] transition-all">
                                                    {rideStatus === "searching" ? "SCANNING_GRID..." : "REQUEST_DISPATCH"}
                                                </Button>
                                            </Card>
                                        </motion.div>
                                    ) : rideStatus === "offers" ? (
                                        <motion.div key="offers" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="h-full">
                                            <Card className="border-primary/10 bg-white h-full overflow-hidden shadow-sm flex flex-col p-8 gap-6 rounded-[2.5rem]">
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-6 shrink-0">
                                                    <div>
                                                        <h2 className="text-xl font-black uppercase tracking-widest italic text-primary">Live_Offers</h2>
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Network found 3 available</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => setRideStatus("idle")} className="text-slate-300 hover:text-slate-600"><XCircle /></Button>
                                                </div>
                                                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                                    {offers.map(offer => (
                                                        <button key={offer.id} onClick={() => handleConfirmOffer(offer)} className="w-full p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-md transition-all text-left flex items-center justify-between group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl italic">{offer.driverName.charAt(0)}</div>
                                                                <div>
                                                                    <div className="font-black italic text-sm group-hover:text-primary transition-colors text-slate-900">{offer.driverName}</div>
                                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{offer.carModel} • {offer.eta}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-xl font-black italic text-slate-900 leading-none">${offer.price.toFixed(2)}</div>
                                                                <div className="flex items-center gap-1 justify-end mt-1 text-[8px] font-black text-amber-500"><Star className="h-2 w-2 fill-amber-500" />{offer.rating}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
                                            <Card className="border-primary/20 bg-primary/[0.02] h-full p-8 flex flex-col justify-between relative overflow-hidden rounded-[2.5rem] shadow-sm">
                                                <div className="absolute top-0 right-0 p-6"><Badge className="bg-primary text-white font-black text-[9px] uppercase px-4 py-1.5 shadow-md animate-pulse">GRID_MOD_ACTIVE</Badge></div>
                                                <div className="pt-10 text-center">
                                                    <div className="h-24 w-24 rounded-3xl bg-white border border-primary/10 mx-auto flex items-center justify-center text-primary text-5xl font-black italic shadow-sm mb-6">{activeTrip?.driverName.charAt(0)}</div>
                                                    <h3 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">{activeTrip?.driverName}</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">{activeTrip?.carModel} • {activeTrip?.carPlate}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-8 my-8">
                                                    <div className="text-center border-r border-gray-100">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Arival_ETA</p>
                                                        <p className="text-2xl font-black italic text-primary">{formatETA(etaSeconds)}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total_Yield</p>
                                                        <p className="text-2xl font-black italic text-slate-900">{activeTrip?.price}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4 shrink-0">
                                                    <Button className="w-full h-16 rounded-2xl bg-white border border-gray-200 shadow-sm text-slate-700 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50"><ShieldCheck className="h-4 w-4 mr-3 text-primary" />ENCRYPTED_CALL</Button>
                                                    <Button variant="ghost" onClick={cancelRide} className="w-full h-12 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-colors">TERMINATE_MISSION</Button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Map Side */}
                            <motion.div className="lg:col-span-8 h-full min-h-[400px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                <div className="h-full rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-sm bg-white relative">
                                    <div className="absolute top-8 left-8 z-10 flex flex-col gap-3">
                                        <div className="bg-white/90 px-6 py-3 flex items-center gap-4 backdrop-blur-md border border-gray-100 shadow-sm rounded-2xl">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgb(var(--primary))]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">GRID_OS_4.2.0</span>
                                        </div>
                                        {rideStatus === "found" && (
                                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/90 px-6 py-4 flex items-center gap-4 backdrop-blur-md border border-primary/20 shadow-sm rounded-2xl">
                                                <Badge className="bg-primary text-white font-black text-[9px] uppercase">TRACKING</Badge>
                                                <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">DRIVER_INBOUND: SECTOR_7</span>
                                            </motion.div>
                                        )}
                                    </div>
                                    <InteractiveMap className="w-full h-full" onNodeSelect={n => { if (rideStatus === "idle") setDestination(`Node ${n.id}`) }} />
                                    <div className="absolute bottom-8 right-8 z-10 flex gap-4">
                                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-white border-gray-100 shadow-sm text-slate-400 hover:text-primary transition-all text-xl font-black">?</Button>
                                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-white border-gray-100 shadow-sm text-slate-400 hover:text-primary transition-all text-xl font-black"><LocateFixed className="h-6 w-6" /></Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 overflow-hidden outline-none m-0">
                        <div className="h-full flex flex-col items-center justify-center opacity-30">
                            <Smartphone className="h-20 w-20 mb-4 text-slate-400" />
                            <p className="font-black uppercase tracking-[0.5em] text-slate-400">Network Logs Empty</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function LocateFixed(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="2" x2="5" y1="12" y2="12" />
            <line x1="19" x2="22" y1="12" y2="12" />
            <line x1="12" x2="12" y1="2" y2="5" />
            <line x1="12" x2="12" y1="19" y2="22" />
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
