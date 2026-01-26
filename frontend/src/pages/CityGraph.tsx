import { useState } from "react";
import { Info, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import GTACityMap from "@/components/GTACityMap";

const zoneColors = {
  downtown: { bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-400" },
  residential: { bg: "bg-green-500/20", border: "border-green-500", text: "text-green-400" },
  commercial: { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-400" },
  industrial: { bg: "bg-amber-500/20", border: "border-amber-500", text: "text-amber-400" },
  waterfront: { bg: "bg-cyan-500/20", border: "border-cyan-500", text: "text-cyan-400" },
  airport: { bg: "bg-red-500/20", border: "border-red-500", text: "text-red-400" },
};

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export default function CityGraph() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { data: graphData } = useQuery({
    queryKey: ["graph"],
    queryFn: api.getGraph,
  });

  const { data: status } = useQuery({
    queryKey: ["status"],
    queryFn: api.getStatus,
  });

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Map</h1>
          <p className="text-muted-foreground mt-1">Real-time navigation topology and node status.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Map Canvas */}
        <div className="flex-1 glass-card overflow-hidden relative">
          <GTACityMap
            onNodeSelect={setSelectedNode}
            showDrivers={true}
            showRiders={true}
            showNavigation={true}
            className="h-full"
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto">
          {/* Legend */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              DSA Concepts
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-muted border-2 border-border mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Vertex (Node)</div>
                  <div className="text-muted-foreground text-xs">Location in the city graph</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-0.5 bg-muted-foreground mt-2" />
                <div>
                  <div className="font-medium text-foreground">Edge</div>
                  <div className="text-muted-foreground text-xs">Road connecting two locations</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono mt-0.5">12</div>
                <div>
                  <div className="font-medium text-foreground">Weight</div>
                  <div className="text-muted-foreground text-xs">Distance/time between nodes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Zones */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              City Districts
            </h3>
            <div className="space-y-2">
              {Object.entries(zoneColors).map(([zone, colors]) => (
                <div key={zone} className={cn("flex items-center justify-between p-2 rounded-lg", colors.bg)}>
                  <span className={cn("font-medium capitalize", colors.text)}>{zone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Node Info */}
          {selectedNode && (
            <div className="glass-card p-4 animate-scale-in">
              <h3 className="font-semibold text-foreground mb-3">Selected: {selectedNode.name || selectedNode.id}</h3>
              <div className="space-y-2 text-sm">
                {selectedNode.type === "driver" && (
                  <>
                    <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="capitalize">{selectedNode.status}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span>{selectedNode.vehicle}</span></div>
                  </>
                )}
                {selectedNode.zone && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Zone</span><span className="capitalize">{selectedNode.zone}</span></div>
                )}
              </div>
            </div>
          )}

          {/* Graph Stats */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-foreground mb-3">Live Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{graphData?.nodes || 0}</div>
                <div className="text-xs text-muted-foreground">Nav Nodes</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{graphData?.edges || 0}</div>
                <div className="text-xs text-muted-foreground">Roads</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-success">{status?.drivers || 0}</div>
                <div className="text-xs text-muted-foreground">Drivers</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-warning">{(graphData?.zones?.length || 0)}</div>
                <div className="text-xs text-muted-foreground">Zones</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}