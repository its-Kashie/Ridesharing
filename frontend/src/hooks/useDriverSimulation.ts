import { useState, useRef, useEffect, useCallback } from "react";
import {
  dijkstra,
  findNearestNode,
  getNodeById,
  lerp,
  calculateHeading,
  calculateDistance,
  generateRandomRoute,
  PATHFINDING_NODES,
} from "@/lib/pathfinding";

export type DriverStatus = "available" | "busy" | "offline" | "en_route" | "picking_up" | "dropping_off";

export interface SimulatedDriver {
  id: string;
  name: string;
  status: DriverStatus;
  vehicle: string;
  
  // Position
  x: number;
  y: number;
  heading: number;
  
  // Route
  route: string[];
  routeIndex: number;
  segmentProgress: number;
  speed: number;
  
  // Trip info
  pickup?: { x: number; y: number; name: string };
  dropoff?: { x: number; y: number; name: string };
  rider?: { id: string; name: string };
}

export interface SimulatedRider {
  id: string;
  name: string;
  x: number;
  y: number;
  destination: string;
  status: "waiting" | "picked_up" | "completed";
  assignedDriver?: string;
}

interface UseDriverSimulationOptions {
  initialDrivers: Array<{ id: string; x: number; y: number; name: string; status: string; vehicle: string }>;
  initialRiders: Array<{ id: string; x: number; y: number; name: string; destination: string }>;
}

export function useDriverSimulation({ initialDrivers, initialRiders }: UseDriverSimulationOptions) {
  const [drivers, setDrivers] = useState<SimulatedDriver[]>(() =>
    initialDrivers.map((d) => ({
      ...d,
      status: d.status as DriverStatus,
      heading: 0,
      route: [],
      routeIndex: 0,
      segmentProgress: 0,
      speed: 0.02, // Progress per frame
    }))
  );

  const [riders, setRiders] = useState<SimulatedRider[]>(() =>
    initialRiders.map((r) => ({
      ...r,
      status: "waiting" as const,
    }))
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showRoutes, setShowRoutes] = useState(true);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Assign a trip to an available driver
  const assignTrip = useCallback((driverId: string, riderId: string) => {
    const rider = riders.find((r) => r.id === riderId);
    const driver = drivers.find((d) => d.id === driverId);
    
    if (!rider || !driver || driver.status !== "available") return;

    // Find nearest nodes
    const driverNode = findNearestNode(driver.x, driver.y);
    const pickupNode = findNearestNode(rider.x, rider.y);
    
    if (!driverNode || !pickupNode) return;

    // Calculate route to pickup
    const routeToPickup = dijkstra(driverNode.id, pickupNode.id);

    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              status: "en_route" as DriverStatus,
              route: routeToPickup,
              routeIndex: 0,
              segmentProgress: 0,
              pickup: { x: rider.x, y: rider.y, name: rider.name },
              rider: { id: rider.id, name: rider.name },
            }
          : d
      )
    );

    setRiders((prev) =>
      prev.map((r) =>
        r.id === riderId ? { ...r, assignedDriver: driverId } : r
      )
    );
  }, [drivers, riders]);

  // Assign random trips to available drivers
  const assignRandomTrips = useCallback(() => {
    const availableDrivers = drivers.filter((d) => d.status === "available");
    const waitingRiders = riders.filter((r) => r.status === "waiting" && !r.assignedDriver);

    availableDrivers.forEach((driver, index) => {
      if (waitingRiders[index]) {
        assignTrip(driver.id, waitingRiders[index].id);
      } else {
        // No waiting riders, give driver a random patrol route
        const { path } = generateRandomRoute();
        if (path.length > 1) {
          setDrivers((prev) =>
            prev.map((d) =>
              d.id === driver.id
                ? {
                    ...d,
                    status: "busy" as DriverStatus,
                    route: path,
                    routeIndex: 0,
                    segmentProgress: 0,
                  }
                : d
            )
          );
        }
      }
    });
  }, [drivers, riders, assignTrip]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update at roughly 60fps
      if (deltaTime > 0) {
        const speedMultiplier = simulationSpeed * (deltaTime / 16.67);

        setDrivers((prevDrivers) =>
          prevDrivers.map((driver) => {
            // Skip offline drivers or those without routes
            if (driver.status === "offline" || driver.route.length < 2) {
              return driver;
            }

            const currentNodeId = driver.route[driver.routeIndex];
            const nextNodeId = driver.route[driver.routeIndex + 1];

            if (!nextNodeId) {
              // Route completed
              if (driver.status === "en_route" && driver.pickup) {
                // Arrived at pickup, now go to dropoff
                const pickupNode = findNearestNode(driver.pickup.x, driver.pickup.y);
                
                // Find a random destination
                const destinations = PATHFINDING_NODES.filter(n => n.id !== pickupNode?.id);
                const destNode = destinations[Math.floor(Math.random() * destinations.length)];
                
                if (pickupNode && destNode) {
                  const routeToDropoff = dijkstra(pickupNode.id, destNode.id);
                  
                  // Update rider status
                  if (driver.rider) {
                    setRiders((prev) =>
                      prev.map((r) =>
                        r.id === driver.rider?.id ? { ...r, status: "picked_up" } : r
                      )
                    );
                  }

                  return {
                    ...driver,
                    status: "dropping_off" as DriverStatus,
                    route: routeToDropoff,
                    routeIndex: 0,
                    segmentProgress: 0,
                    dropoff: { x: destNode.x, y: destNode.y, name: destNode.zone },
                  };
                }
              } else if (driver.status === "dropping_off") {
                // Trip completed
                if (driver.rider) {
                  setRiders((prev) =>
                    prev.map((r) =>
                      r.id === driver.rider?.id ? { ...r, status: "completed" } : r
                    )
                  );
                }

                return {
                  ...driver,
                  status: "available" as DriverStatus,
                  route: [],
                  routeIndex: 0,
                  segmentProgress: 0,
                  pickup: undefined,
                  dropoff: undefined,
                  rider: undefined,
                };
              } else {
                // Regular route completed, become available
                return {
                  ...driver,
                  status: "available" as DriverStatus,
                  route: [],
                  routeIndex: 0,
                  segmentProgress: 0,
                };
              }
            }

            const currentNode = getNodeById(currentNodeId);
            const nextNode = getNodeById(nextNodeId);

            if (!currentNode || !nextNode) {
              return driver;
            }

            // Calculate new position
            const newProgress = driver.segmentProgress + driver.speed * speedMultiplier;
            const newX = lerp(currentNode.x, nextNode.x, newProgress);
            const newY = lerp(currentNode.y, nextNode.y, newProgress);
            const heading = calculateHeading(currentNode.x, currentNode.y, nextNode.x, nextNode.y);

            if (newProgress >= 1) {
              // Move to next segment
              return {
                ...driver,
                x: nextNode.x,
                y: nextNode.y,
                heading,
                routeIndex: driver.routeIndex + 1,
                segmentProgress: 0,
              };
            }

            return {
              ...driver,
              x: newX,
              y: newY,
              heading,
              segmentProgress: newProgress,
            };
          })
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, simulationSpeed]);

  // Reset simulation
  const reset = useCallback(() => {
    setDrivers(
      initialDrivers.map((d) => ({
        ...d,
        status: d.status as DriverStatus,
        heading: 0,
        route: [],
        routeIndex: 0,
        segmentProgress: 0,
        speed: 0.02,
      }))
    );
    setRiders(
      initialRiders.map((r) => ({
        ...r,
        status: "waiting" as const,
        assignedDriver: undefined,
      }))
    );
  }, [initialDrivers, initialRiders]);

  // Get route path for visualization
  const getDriverRoutePath = useCallback((driver: SimulatedDriver): string => {
    if (driver.route.length < 2) return "";

    const points: string[] = [];
    
    // Start from current position
    points.push(`${driver.x},${driver.y}`);
    
    // Add remaining route nodes
    for (let i = driver.routeIndex + 1; i < driver.route.length; i++) {
      const node = getNodeById(driver.route[i]);
      if (node) {
        points.push(`${node.x},${node.y}`);
      }
    }

    return points.join(" ");
  }, []);

  return {
    drivers,
    riders,
    isPlaying,
    setIsPlaying,
    simulationSpeed,
    setSimulationSpeed,
    showRoutes,
    setShowRoutes,
    assignTrip,
    assignRandomTrips,
    reset,
    getDriverRoutePath,
  };
}
