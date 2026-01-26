import React, { useState, useRef } from "react";
import {
  Plus,
  Minus,
  Navigation2,
  MapPin,
  Layers,
  LocateFixed,
  Car,
  User,
  Building2,
  TreePine,
  Waves,
  Mountain,
  Fuel,
  ShoppingBag,
  GraduationCap,
  Hospital,
  Plane,
  Train,
  Home,
  Zap,
  Route,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDriverSimulation, SimulatedDriver } from "@/hooks/useDriverSimulation";
import { getNodeById } from "@/lib/pathfinding";
import SimulationControls from "@/components/SimulationControls";

// City zones with distinct colors (GTA-style districts)
const ZONES = {
  downtown: { name: "Downtown", color: "#3B82F6", bgColor: "rgba(59, 130, 246, 0.1)" },
  industrial: { name: "Industrial", color: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.1)" },
  residential: { name: "Residential", color: "#10B981", bgColor: "rgba(16, 185, 129, 0.1)" },
  commercial: { name: "Commercial", color: "#8B5CF6", bgColor: "rgba(139, 92, 246, 0.1)" },
  waterfront: { name: "Waterfront", color: "#06B6D4", bgColor: "rgba(6, 182, 212, 0.1)" },
  airport: { name: "Airport", color: "#EF4444", bgColor: "rgba(239, 68, 68, 0.1)" },
};

// Road network definition
const ROADS = {
  highways: [
    { id: "h1", points: [[50, 400], [950, 400]], name: "Interstate 85", type: "highway" },
    { id: "h2", points: [[500, 50], [500, 750]], name: "Highway 101", type: "highway" },
    { id: "h3", points: [[100, 100], [900, 700]], name: "Diagonal Freeway", type: "highway" },
  ],
  mainRoads: [
    { id: "m1", points: [[150, 150], [850, 150]], name: "North Boulevard", type: "main" },
    { id: "m2", points: [[150, 300], [450, 300]], name: "West Avenue", type: "main" },
    { id: "m3", points: [[550, 300], [850, 300]], name: "East Avenue", type: "main" },
    { id: "m4", points: [[150, 550], [850, 550]], name: "South Street", type: "main" },
    { id: "m5", points: [[200, 100], [200, 650]], name: "First Street", type: "main" },
    { id: "m6", points: [[350, 100], [350, 650]], name: "Second Street", type: "main" },
    { id: "m7", points: [[650, 100], [650, 650]], name: "Third Street", type: "main" },
    { id: "m8", points: [[800, 100], [800, 650]], name: "Fourth Street", type: "main" },
  ],
  streets: [
    { id: "s1", points: [[180, 180], [320, 180]], type: "street" },
    { id: "s2", points: [[180, 220], [320, 220]], type: "street" },
    { id: "s3", points: [[180, 260], [320, 260]], type: "street" },
    { id: "s4", points: [[380, 180], [480, 180]], type: "street" },
    { id: "s5", points: [[520, 180], [620, 180]], type: "street" },
    { id: "s6", points: [[680, 180], [780, 180]], type: "street" },
    { id: "s7", points: [[680, 220], [780, 220]], type: "street" },
    { id: "s8", points: [[150, 480], [320, 480]], type: "street" },
    { id: "s9", points: [[380, 480], [480, 480]], type: "street" },
    { id: "s10", points: [[520, 480], [620, 480]], type: "street" },
    { id: "s11", points: [[680, 480], [850, 480]], type: "street" },
    { id: "s12", points: [[150, 620], [320, 620]], type: "street" },
    { id: "s13", points: [[680, 620], [850, 620]], type: "street" },
  ],
};

// Buildings and landmarks
const BUILDINGS = [
  // Downtown
  { id: "b1", x: 420, y: 180, w: 60, h: 80, type: "skyscraper", zone: "downtown", name: "RideFlow HQ" },
  { id: "b2", x: 500, y: 160, w: 40, h: 60, type: "office", zone: "downtown", name: "Tech Center" },
  { id: "b3", x: 550, y: 180, w: 50, h: 70, type: "skyscraper", zone: "downtown", name: "Finance Tower" },
  { id: "b4", x: 460, y: 280, w: 45, h: 55, type: "office", zone: "downtown", name: "City Hall" },

  // Commercial
  { id: "b5", x: 700, y: 160, w: 70, h: 50, type: "mall", zone: "commercial", name: "Metro Mall" },
  { id: "b6", x: 720, y: 230, w: 50, h: 40, type: "shop", zone: "commercial", name: "Plaza" },

  // Residential
  { id: "b7", x: 180, y: 180, w: 35, h: 45, type: "house", zone: "residential", name: "Green Hills" },
  { id: "b8", x: 230, y: 200, w: 30, h: 40, type: "house", zone: "residential" },
  { id: "b9", x: 280, y: 180, w: 35, h: 50, type: "apartment", zone: "residential" },
  { id: "b10", x: 180, y: 240, w: 40, h: 35, type: "house", zone: "residential" },
  { id: "b11", x: 240, y: 250, w: 35, h: 35, type: "house", zone: "residential" },

  // Industrial
  { id: "b12", x: 700, y: 500, w: 80, h: 60, type: "factory", zone: "industrial", name: "Steel Works" },
  { id: "b13", x: 800, y: 520, w: 60, h: 50, type: "warehouse", zone: "industrial" },
  { id: "b14", x: 720, y: 580, w: 70, h: 45, type: "factory", zone: "industrial" },

  // Waterfront
  { id: "b15", x: 150, y: 500, w: 60, h: 40, type: "marina", zone: "waterfront", name: "Marina Bay" },
  { id: "b16", x: 220, y: 520, w: 50, h: 50, type: "restaurant", zone: "waterfront", name: "Seaside Diner" },

  // Airport
  { id: "b17", x: 100, y: 620, w: 150, h: 80, type: "terminal", zone: "airport", name: "Metro Airport" },
];

// POI (Points of Interest)
const POIS = [
  { id: "poi1", x: 350, y: 200, type: "hospital", name: "Central Hospital", zone: "downtown" },
  { id: "poi2", x: 250, y: 350, type: "university", name: "State University", zone: "residential" },
  { id: "poi3", x: 600, y: 120, type: "station", name: "Central Station", zone: "commercial" },
  { id: "poi4", x: 820, y: 200, type: "fuel", name: "Gas Station", zone: "commercial" },
  { id: "poi5", x: 450, y: 350, type: "park", name: "Central Park", zone: "downtown" },
  { id: "poi6", x: 150, y: 650, type: "airport", name: "Airport Terminal", zone: "airport" },
];

// Drivers on map
const INITIAL_DRIVERS = [
  { id: "d1", x: 280, y: 200, name: "Ahmad Khan", status: "available", vehicle: "Toyota Camry" },
  { id: "d2", x: 550, y: 280, name: "Sara Ahmed", status: "busy", vehicle: "Honda Civic" },
  { id: "d3", x: 720, y: 450, name: "Ali Hassan", status: "available", vehicle: "Suzuki Swift" },
  { id: "d4", x: 400, y: 500, name: "Fatima Zahra", status: "offline", vehicle: "KIA Sportage" },
  { id: "d5", x: 180, y: 550, name: "Bilal Sheikh", status: "available", vehicle: "Toyota Corolla" },
];

// Riders waiting
const INITIAL_RIDERS = [
  { id: "r1", x: 450, y: 190, name: "John Doe", destination: "Airport" },
  { id: "r2", x: 750, y: 220, name: "Jane Smith", destination: "Downtown" },
  { id: "r3", x: 200, y: 480, name: "Mike Wilson", destination: "Mall" },
];

// Navigation nodes for pathfinding
const NAV_NODES = [
  { id: "n1", x: 200, y: 150, zone: "residential" },
  { id: "n2", x: 350, y: 150, zone: "residential" },
  { id: "n3", x: 500, y: 150, zone: "downtown" },
  { id: "n4", x: 650, y: 150, zone: "commercial" },
  { id: "n5", x: 800, y: 150, zone: "commercial" },
  { id: "n6", x: 200, y: 300, zone: "residential" },
  { id: "n7", x: 350, y: 300, zone: "downtown" },
  { id: "n8", x: 500, y: 400, zone: "downtown" },
  { id: "n9", x: 650, y: 300, zone: "commercial" },
  { id: "n10", x: 800, y: 300, zone: "commercial" },
  { id: "n11", x: 200, y: 550, zone: "waterfront" },
  { id: "n12", x: 350, y: 550, zone: "waterfront" },
  { id: "n13", x: 500, y: 550, zone: "downtown" },
  { id: "n14", x: 650, y: 550, zone: "industrial" },
  { id: "n15", x: 800, y: 550, zone: "industrial" },
  { id: "n16", x: 150, y: 650, zone: "airport" },
];

interface GTACityMapProps {
  onNodeSelect?: (node: any) => void;
  showDrivers?: boolean;
  showRiders?: boolean;
  showNavigation?: boolean;
  selectedRoute?: string[];
  highlightedZone?: string;
  className?: string;
}

export default function GTACityMap({
  onNodeSelect,
  showDrivers = true,
  showRiders = true,
  showNavigation = false,
  selectedRoute = [],
  highlightedZone,
  className = ""
}: GTACityMapProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Use the driver simulation hook
  const {
    drivers,
    riders,
    isPlaying,
    setIsPlaying,
    simulationSpeed,
    setSimulationSpeed,
    showRoutes,
    setShowRoutes,
    assignRandomTrips,
    reset,
    getDriverRoutePath,
  } = useDriverSimulation({
    initialDrivers: INITIAL_DRIVERS,
    initialRiders: INITIAL_RIDERS,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === mapRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 0.5), 4));
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const getZoneColor = (zone: string) => ZONES[zone as keyof typeof ZONES]?.color || "#666";
  const getZoneBg = (zone: string) => ZONES[zone as keyof typeof ZONES]?.bgColor || "rgba(100,100,100,0.1)";

  const renderRoad = (road: any) => {
    const points = road.points;
    const pathD = `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;

    const strokeWidth = road.type === "highway" ? 12 : road.type === "main" ? 6 : 3;
    const strokeColor = road.type === "highway" ? "#94A3B8" : road.type === "main" ? "#CBD5E1" : "#E2E8F0";
    const dashArray = road.type === "highway" ? "none" : road.type === "main" ? "none" : "none";

    return (
      <g key={road.id}>
        {/* Road background */}
        <path
          d={pathD}
          stroke={strokeColor}
          strokeWidth={strokeWidth + 4}
          strokeLinecap="round"
          fill="none"
        />
        {/* Road surface */}
        <path
          d={pathD}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        {/* Center line for highways */}
        {road.type === "highway" && (
          <path
            d={pathD}
            stroke="#FCD34D"
            strokeWidth={1}
            strokeDasharray="20,10"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {/* Lane markings */}
        {road.type === "main" && (
          <path
            d={pathD}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={0.5}
            strokeDasharray="10,5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>
    );
  };

  const renderBuilding = (building: any) => {
    const zoneColor = getZoneColor(building.zone);
    const isSelected = selectedItem?.id === building.id;

    return (
      <g
        key={building.id}
        transform={`translate(${building.x}, ${building.y})`}
        className="cursor-pointer"
        onClick={() => {
          setSelectedItem(building);
          onNodeSelect?.(building);
        }}
      >
        {/* Building shadow */}
        <rect
          x={4}
          y={4}
          width={building.w}
          height={building.h}
          fill="rgba(0,0,0,0.3)"
          rx={2}
        />
        {/* Building base */}
        <rect
          width={building.w}
          height={building.h}
          fill={zoneColor}
          fillOpacity={0.8}
          stroke={isSelected ? "#fff" : zoneColor}
          strokeWidth={isSelected ? 2 : 1}
          rx={2}
          className="transition-all duration-200"
        />
        {/* Building windows pattern */}
        {building.type === "skyscraper" && (
          <>
            {Array.from({ length: Math.floor(building.h / 10) }).map((_, i) => (
              <g key={i}>
                {Array.from({ length: Math.floor(building.w / 8) }).map((_, j) => (
                  <rect
                    key={j}
                    x={4 + j * 8}
                    y={4 + i * 10}
                    width={4}
                    height={6}
                    fill="rgba(255,255,200,0.6)"
                    rx={0.5}
                  />
                ))}
              </g>
            ))}
          </>
        )}
        {/* Building label */}
        {building.name && zoom > 1.2 && (
          <text
            x={building.w / 2}
            y={building.h + 12}
            textAnchor="middle"
            className="fill-foreground text-[8px] font-medium"
          >
            {building.name}
          </text>
        )}
      </g>
    );
  };

  const renderPOI = (poi: any) => {
    const IconComponent = {
      hospital: Hospital,
      university: GraduationCap,
      station: Train,
      fuel: Fuel,
      park: TreePine,
      airport: Plane,
    }[poi.type] || MapPin;

    const isSelected = selectedItem?.id === poi.id;

    return (
      <g
        key={poi.id}
        transform={`translate(${poi.x}, ${poi.y})`}
        className="cursor-pointer"
        onClick={() => {
          setSelectedItem(poi);
          onNodeSelect?.(poi);
        }}
      >
        <circle
          r={16}
          fill="hsl(var(--background))"
          stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
          strokeWidth={isSelected ? 3 : 2}
          className="transition-all duration-200"
        />
        <foreignObject x={-8} y={-8} width={16} height={16}>
          <div className="flex items-center justify-center w-full h-full">
            <IconComponent className="h-4 w-4 text-primary" />
          </div>
        </foreignObject>
        {zoom > 1.5 && (
          <text
            y={28}
            textAnchor="middle"
            className="fill-foreground text-[7px] font-medium"
          >
            {poi.name}
          </text>
        )}
      </g>
    );
  };

  const renderDriver = (driver: SimulatedDriver) => {
    const statusColor = {
      available: "#10B981",
      busy: "#F59E0B",
      offline: "#6B7280",
      en_route: "#3B82F6",
      picking_up: "#8B5CF6",
      dropping_off: "#F59E0B",
    }[driver.status] || "#6B7280";

    const isSelected = selectedItem?.id === driver.id;
    const hasRoute = driver.route.length >= 2;

    return (
      <g key={driver.id}>
        {/* Route visualization */}
        {showRoutes && hasRoute && (
          <g className="driver-route">
            {/* Route shadow */}
            <polyline
              points={getDriverRoutePath(driver)}
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated route line */}
            <polyline
              points={getDriverRoutePath(driver)}
              fill="none"
              stroke={driver.status === "dropping_off" ? "#F59E0B" : "#3B82F6"}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10,10"
              className="animate-dash"
            />
            {/* Destination marker */}
            {driver.dropoff && (
              <g transform={`translate(${driver.dropoff.x}, ${driver.dropoff.y})`}>
                <circle r={8} fill="hsl(var(--destructive))" className="animate-pulse" />
                <foreignObject x={-4} y={-4} width={8} height={8}>
                  <div className="flex items-center justify-center w-full h-full">
                    <MapPin className="h-2 w-2 text-white" />
                  </div>
                </foreignObject>
              </g>
            )}
            {/* Pickup marker */}
            {driver.pickup && driver.status === "en_route" && (
              <g transform={`translate(${driver.pickup.x}, ${driver.pickup.y})`}>
                <circle r={8} fill="hsl(var(--primary))" className="animate-pulse" />
                <foreignObject x={-4} y={-4} width={8} height={8}>
                  <div className="flex items-center justify-center w-full h-full">
                    <User className="h-2 w-2 text-white" />
                  </div>
                </foreignObject>
              </g>
            )}
          </g>
        )}

        {/* Driver car */}
        <g
          transform={`translate(${driver.x}, ${driver.y})`}
          className="cursor-pointer driver-car"
          onClick={() => {
            setSelectedItem({ ...driver, type: "driver" });
            onNodeSelect?.({ ...driver, type: "driver" });
          }}
        >
          {/* Pulse animation for available drivers */}
          {driver.status === "available" && (
            <circle r={20} fill={statusColor} fillOpacity={0.2} className="animate-ping" />
          )}
          {/* Driver marker with rotation */}
          <g transform={`rotate(${driver.heading + 90})`}>
            <ellipse
              rx={14}
              ry={8}
              fill={statusColor}
              stroke="hsl(var(--background))"
              strokeWidth={isSelected ? 4 : 2}
              filter="url(#glow)"
            />
            {/* Car direction indicator */}
            <polygon
              points="14,0 10,-4 10,4"
              fill="hsl(var(--background))"
            />
          </g>
          {/* Car icon */}
          <foreignObject x={-6} y={-6} width={12} height={12}>
            <div className="flex items-center justify-center w-full h-full">
              <Car className="h-3 w-3 text-white" />
            </div>
          </foreignObject>
          {/* Driver label */}
          {zoom > 1.2 && (
            <text
              y={24}
              textAnchor="middle"
              className="fill-foreground text-[8px] font-bold"
            >
              {driver.name.split(' ')[0]}
            </text>
          )}
          {/* Status badge */}
          {driver.status !== "available" && driver.status !== "offline" && (
            <g transform="translate(10, -10)">
              <rect
                x={-20}
                y={-6}
                width={40}
                height={12}
                rx={6}
                fill={statusColor}
                fillOpacity={0.9}
              />
              <text
                textAnchor="middle"
                y={3}
                className="fill-white text-[6px] font-bold uppercase"
              >
                {driver.status.replace("_", " ")}
              </text>
            </g>
          )}
        </g>
      </g>
    );
  };

  const renderRider = (rider: any) => {
    const isSelected = selectedItem?.id === rider.id;

    return (
      <g
        key={rider.id}
        transform={`translate(${rider.x}, ${rider.y})`}
        className="cursor-pointer"
        onClick={() => {
          setSelectedItem({ ...rider, type: "rider" });
          onNodeSelect?.({ ...rider, type: "rider" });
        }}
      >
        <circle r={14} fill="hsl(var(--destructive))" fillOpacity={0.2} className="animate-pulse" />
        <circle
          r={10}
          fill="hsl(var(--destructive))"
          stroke="hsl(var(--background))"
          strokeWidth={isSelected ? 4 : 2}
        />
        <foreignObject x={-5} y={-5} width={10} height={10}>
          <div className="flex items-center justify-center w-full h-full">
            <User className="h-3 w-3 text-white" />
          </div>
        </foreignObject>
        {zoom > 1.2 && (
          <text
            y={22}
            textAnchor="middle"
            className="fill-foreground text-[8px] font-bold"
          >
            {rider.name.split(' ')[0]}
          </text>
        )}
      </g>
    );
  };

  const renderNavNode = (node: any) => {
    const isInRoute = selectedRoute.includes(node.id);
    const isSelected = selectedItem?.id === node.id;

    return (
      <g
        key={node.id}
        transform={`translate(${node.x}, ${node.y})`}
        className="cursor-pointer"
        onClick={() => {
          setSelectedItem({ ...node, type: "navNode" });
          onNodeSelect?.({ ...node, type: "navNode" });
        }}
      >
        <circle
          r={isInRoute ? 10 : 6}
          fill={isInRoute ? "hsl(var(--primary))" : "hsl(var(--muted))"}
          stroke={isSelected ? "#fff" : isInRoute ? "hsl(var(--primary))" : "hsl(var(--border))"}
          strokeWidth={isSelected ? 3 : isInRoute ? 2 : 1}
          className="transition-all duration-300"
        />
        <text
          y={-12}
          textAnchor="middle"
          className={cn(
            "text-[8px] font-mono",
            isInRoute ? "fill-primary font-bold" : "fill-muted-foreground"
          )}
        >
          {node.id}
        </text>
      </g>
    );
  };

  return (
    <div className={cn("relative w-full h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm", className)}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex flex-col bg-background/90 backdrop-blur-md border border-glass-border rounded-lg overflow-hidden shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none border-b border-glass-border hover:bg-primary/20"
            onClick={() => setZoom(z => Math.min(z + 0.3, 4))}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="px-2 py-1 text-[10px] font-mono text-center text-muted-foreground border-b border-glass-border">
            {Math.round(zoom * 100)}%
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none hover:bg-primary/20"
            onClick={() => setZoom(z => Math.max(z - 0.3, 0.5))}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-lg bg-background/90 backdrop-blur-md border border-glass-border shadow-lg hover:bg-primary/20"
          onClick={resetView}
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 rounded-lg bg-background/90 backdrop-blur-md border border-glass-border shadow-lg hover:bg-primary/20"
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Simulation Controls */}
      <div className="absolute top-48 right-4 z-20 w-64">
        <SimulationControls
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={reset}
          simulationSpeed={simulationSpeed}
          onSpeedChange={setSimulationSpeed}
          showRoutes={showRoutes}
          onShowRoutesChange={setShowRoutes}
          onAssignTrips={assignRandomTrips}
          availableDrivers={drivers.filter((d) => d.status === "available").length}
          activeTrips={drivers.filter((d) => ["en_route", "picking_up", "dropping_off"].includes(d.status)).length}
        />
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
        <div className="px-3 py-1.5 bg-background/90 backdrop-blur-md border border-glass-border rounded-full shadow-lg flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", isPlaying ? "bg-success animate-pulse" : "bg-warning")} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{isPlaying ? "Live" : "Paused"}</span>
        </div>
        <div className="px-3 py-1.5 bg-background/90 backdrop-blur-md border border-glass-border rounded-full shadow-lg flex items-center gap-2">
          <Navigation2 className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{simulationSpeed}x Speed</span>
        </div>
        {showDrivers && (
          <div className="px-3 py-1.5 bg-background/90 backdrop-blur-md border border-glass-border rounded-full shadow-lg flex items-center gap-2">
            <Car className="h-3 w-3 text-success" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{drivers.filter(d => d.status === "available").length} Available</span>
          </div>
        )}
      </div>

      {/* Selected Item Info */}
      {selectedItem && (
        <div className="absolute top-4 left-4 z-20 glass-card p-4 border-glass-border bg-background/95 backdrop-blur-md max-w-xs animate-scale-in">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-bold text-foreground">{selectedItem.name || selectedItem.id}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedItem(null)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          {selectedItem.type === "driver" && (
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <Badge className={cn(
                  "text-[10px]",
                  selectedItem.status === "available" ? "bg-success/20 text-success" :
                    selectedItem.status === "busy" ? "bg-warning/20 text-warning" : "bg-muted"
                )}>
                  {selectedItem.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">Vehicle: {selectedItem.vehicle}</p>
            </div>
          )}
          {selectedItem.type === "rider" && (
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">Destination: {selectedItem.destination}</p>
              <Badge variant="outline" className="text-[10px]">Waiting for pickup</Badge>
            </div>
          )}
          {selectedItem.zone && (
            <Badge
              className="mt-2 text-[10px]"
              style={{ backgroundColor: getZoneBg(selectedItem.zone), color: getZoneColor(selectedItem.zone) }}
            >
              {ZONES[selectedItem.zone as keyof typeof ZONES]?.name || selectedItem.zone}
            </Badge>
          )}
        </div>
      )}

      {/* Zone Legend */}
      <div className="absolute bottom-4 right-4 z-20 glass-card p-3 border-glass-border bg-background/90 backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Districts</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(ZONES).map(([key, zone]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: zone.color }} />
              <span className="text-[9px] text-muted-foreground">{zone.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div
        ref={mapRef}
        className={cn(
          "w-full h-full cursor-grab active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 800"
          className="pointer-events-none select-none"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
            </pattern>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Water pattern */}
            <pattern id="water" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#0369A1" />
              <path d="M0 10 Q5 5, 10 10 T20 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          </defs>

          <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
            {/* Background */}
            <rect x="-500" y="-500" width="2000" height="1800" fill="#F8FAFC" />
            <rect x="-500" y="-500" width="2000" height="1800" fill="url(#grid)" />

            {/* Zone areas (district backgrounds) */}
            {/* Residential zone */}
            <rect x={140} y={120} width={200} height={200} fill={getZoneBg("residential")} rx={8} />
            {/* Downtown zone */}
            <rect x={380} y={120} width={200} height={300} fill={getZoneBg("downtown")} rx={8} />
            {/* Commercial zone */}
            <rect x={620} y={120} width={220} height={200} fill={getZoneBg("commercial")} rx={8} />
            {/* Waterfront zone */}
            <rect x={120} y={440} width={180} height={140} fill={getZoneBg("waterfront")} rx={8} />
            {/* Industrial zone */}
            <rect x={660} y={440} width={200} height={180} fill={getZoneBg("industrial")} rx={8} />
            {/* Airport zone */}
            <rect x={80} y={590} width={200} height={130} fill={getZoneBg("airport")} rx={8} />

            {/* Water body */}
            <ellipse cx={100} cy={500} rx={60} ry={40} fill="url(#water)" opacity={0.6} />

            {/* Parks/Green areas */}
            <ellipse cx={450} cy={350} rx={40} ry={30} fill="rgba(16, 185, 129, 0.3)" />
            <ellipse cx={300} cy={380} rx={25} ry={20} fill="rgba(16, 185, 129, 0.2)" />

            {/* Roads */}
            <g className="roads">
              {/* Render streets first (bottom layer) */}
              {ROADS.streets.map(renderRoad)}
              {/* Main roads */}
              {ROADS.mainRoads.map(renderRoad)}
              {/* Highways on top */}
              {ROADS.highways.map(renderRoad)}
            </g>

            {/* Buildings */}
            <g className="buildings pointer-events-auto">
              {BUILDINGS.map(renderBuilding)}
            </g>

            {/* POIs */}
            <g className="pois pointer-events-auto">
              {POIS.map(renderPOI)}
            </g>

            {/* Navigation nodes (if enabled) */}
            {showNavigation && (
              <g className="nav-nodes pointer-events-auto">
                {/* Draw connections between nodes */}
                {NAV_NODES.map((node, i) => {
                  // Connect to nearby nodes
                  return NAV_NODES.slice(i + 1).map(otherNode => {
                    const dist = Math.sqrt(
                      Math.pow(node.x - otherNode.x, 2) +
                      Math.pow(node.y - otherNode.y, 2)
                    );
                    if (dist < 250) {
                      const isInRoute = selectedRoute.includes(node.id) && selectedRoute.includes(otherNode.id);
                      return (
                        <line
                          key={`${node.id}-${otherNode.id}`}
                          x1={node.x}
                          y1={node.y}
                          x2={otherNode.x}
                          y2={otherNode.y}
                          stroke={isInRoute ? "hsl(var(--primary))" : "rgba(255,255,255,0.1)"}
                          strokeWidth={isInRoute ? 3 : 1}
                          strokeDasharray={isInRoute ? "none" : "5,5"}
                          className="transition-all duration-300"
                        />
                      );
                    }
                    return null;
                  });
                })}
                {NAV_NODES.map(renderNavNode)}
              </g>
            )}

            {/* Riders */}
            {showRiders && (
              <g className="riders pointer-events-auto">
                {riders.map(renderRider)}
              </g>
            )}

            {/* Drivers */}
            {showDrivers && (
              <g className="drivers pointer-events-auto">
                {drivers.map(renderDriver)}
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
