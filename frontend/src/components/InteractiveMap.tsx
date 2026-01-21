import React from "react";
import GTACityMap from "@/components/GTACityMap";

interface InteractiveMapProps {
  onNodeSelect?: (node: any) => void;
  showDrivers?: boolean;
  showRiders?: boolean;
  showNavigation?: boolean;
  className?: string;
}

export default function InteractiveMap({
  onNodeSelect,
  showDrivers = true,
  showRiders = true,
  showNavigation = true,
  className = "h-[600px]"
}: InteractiveMapProps) {
  return (
    <GTACityMap
      onNodeSelect={onNodeSelect}
      showDrivers={showDrivers}
      showRiders={showRiders}
      showNavigation={showNavigation}
      className={className}
    />
  );
}