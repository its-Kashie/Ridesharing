import React from "react";
import { Play, Pause, RotateCcw, Zap, Route, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SimulationControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  showRoutes: boolean;
  onShowRoutesChange: (show: boolean) => void;
  onAssignTrips: () => void;
  availableDrivers: number;
  activeTrips: number;
}

export default function SimulationControls({
  isPlaying,
  onPlayPause,
  onReset,
  simulationSpeed,
  onSpeedChange,
  showRoutes,
  onShowRoutesChange,
  onAssignTrips,
  availableDrivers,
  activeTrips,
}: SimulationControlsProps) {
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Driver Simulation
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {availableDrivers} available
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {activeTrips} trips
          </Badge>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={isPlaying ? "secondary" : "default"}
          size="sm"
          onClick={onPlayPause}
          className="flex-1"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Play
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Speed</Label>
          <span className="text-xs font-medium">{simulationSpeed}x</span>
        </div>
        <Slider
          value={[simulationSpeed]}
          onValueChange={([value]) => onSpeedChange(value)}
          min={0.5}
          max={5}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Show Routes Toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="show-routes" className="text-xs flex items-center gap-2">
          <Route className="h-3 w-3" />
          Show Routes
        </Label>
        <Switch
          id="show-routes"
          checked={showRoutes}
          onCheckedChange={onShowRoutesChange}
        />
      </div>

      {/* Assign Trips Button */}
      <Button
        variant="default"
        size="sm"
        onClick={onAssignTrips}
        className="w-full glow-primary"
      >
        <Zap className="h-4 w-4 mr-2" />
        Assign Random Trips
      </Button>
    </div>
  );
}
