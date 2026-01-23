// Road network graph and pathfinding utilities

export interface RoadNode {
  id: string;
  x: number;
  y: number;
  zone: string;
  connections: string[];
}

export interface RoadEdge {
  from: string;
  to: string;
  distance: number;
  roadType: "highway" | "main" | "street";
}

// Intersection nodes derived from the road network
export const ROAD_NODES: RoadNode[] = [
  // Highway intersections
  { id: "h1_start", x: 50, y: 400, zone: "waterfront", connections: ["h1_h2", "n11"] },
  { id: "h1_h2", x: 500, y: 400, zone: "downtown", connections: ["h1_start", "h1_end", "h2_h1", "n8"] },
  { id: "h1_end", x: 950, y: 400, zone: "industrial", connections: ["h1_h2", "n15"] },
  { id: "h2_start", x: 500, y: 50, zone: "downtown", connections: ["h2_m1", "n3"] },
  { id: "h2_h1", x: 500, y: 400, zone: "downtown", connections: ["h2_m1", "h2_end", "h1_h2"] },
  { id: "h2_end", x: 500, y: 750, zone: "airport", connections: ["h2_h1", "n16"] },
  
  // Main intersection nodes
  { id: "n1", x: 200, y: 150, zone: "residential", connections: ["n2", "n6", "m5_n1"] },
  { id: "n2", x: 350, y: 150, zone: "residential", connections: ["n1", "n3", "n7", "m6_n2"] },
  { id: "n3", x: 500, y: 150, zone: "downtown", connections: ["n2", "n4", "h2_start", "h2_m1"] },
  { id: "n4", x: 650, y: 150, zone: "commercial", connections: ["n3", "n5", "n9", "m7_n4"] },
  { id: "n5", x: 800, y: 150, zone: "commercial", connections: ["n4", "n10", "m8_n5"] },
  { id: "n6", x: 200, y: 300, zone: "residential", connections: ["n1", "n7", "n11", "m2_n6"] },
  { id: "n7", x: 350, y: 300, zone: "downtown", connections: ["n2", "n6", "n8", "m2_end"] },
  { id: "n8", x: 500, y: 400, zone: "downtown", connections: ["n7", "n9", "n13", "h1_h2", "h2_h1"] },
  { id: "n9", x: 650, y: 300, zone: "commercial", connections: ["n4", "n8", "n10", "n14", "m3_n9"] },
  { id: "n10", x: 800, y: 300, zone: "commercial", connections: ["n5", "n9", "n15", "m3_end"] },
  { id: "n11", x: 200, y: 550, zone: "waterfront", connections: ["n6", "n12", "n16", "h1_start", "m4_n11"] },
  { id: "n12", x: 350, y: 550, zone: "waterfront", connections: ["n11", "n13", "m4_n12"] },
  { id: "n13", x: 500, y: 550, zone: "downtown", connections: ["n8", "n12", "n14", "m4_n13"] },
  { id: "n14", x: 650, y: 550, zone: "industrial", connections: ["n9", "n13", "n15", "m4_n14"] },
  { id: "n15", x: 800, y: 550, zone: "industrial", connections: ["n10", "n14", "h1_end", "m4_end"] },
  { id: "n16", x: 150, y: 650, zone: "airport", connections: ["n11", "h2_end"] },
  
  // Additional road segment nodes
  { id: "h2_m1", x: 500, y: 150, zone: "downtown", connections: ["h2_start", "n3", "h2_h1"] },
  { id: "m5_n1", x: 200, y: 150, zone: "residential", connections: ["n1", "m5_n6"] },
  { id: "m5_n6", x: 200, y: 300, zone: "residential", connections: ["m5_n1", "n6", "m5_n11"] },
  { id: "m5_n11", x: 200, y: 550, zone: "waterfront", connections: ["m5_n6", "n11"] },
  { id: "m6_n2", x: 350, y: 150, zone: "residential", connections: ["n2", "m6_n7"] },
  { id: "m6_n7", x: 350, y: 300, zone: "downtown", connections: ["m6_n2", "n7", "m6_n12"] },
  { id: "m6_n12", x: 350, y: 550, zone: "waterfront", connections: ["m6_n7", "n12"] },
  { id: "m7_n4", x: 650, y: 150, zone: "commercial", connections: ["n4", "m7_n9"] },
  { id: "m7_n9", x: 650, y: 300, zone: "commercial", connections: ["m7_n4", "n9", "m7_n14"] },
  { id: "m7_n14", x: 650, y: 550, zone: "industrial", connections: ["m7_n9", "n14"] },
  { id: "m8_n5", x: 800, y: 150, zone: "commercial", connections: ["n5", "m8_n10"] },
  { id: "m8_n10", x: 800, y: 300, zone: "commercial", connections: ["m8_n5", "n10", "m8_n15"] },
  { id: "m8_n15", x: 800, y: 550, zone: "industrial", connections: ["m8_n10", "n15"] },
  { id: "m2_n6", x: 200, y: 300, zone: "residential", connections: ["n6", "m2_end"] },
  { id: "m2_end", x: 450, y: 300, zone: "downtown", connections: ["m2_n6", "n7"] },
  { id: "m3_n9", x: 650, y: 300, zone: "commercial", connections: ["n9", "m3_end"] },
  { id: "m3_end", x: 850, y: 300, zone: "commercial", connections: ["m3_n9", "n10"] },
  { id: "m4_n11", x: 200, y: 550, zone: "waterfront", connections: ["n11", "m4_n12"] },
  { id: "m4_n12", x: 350, y: 550, zone: "waterfront", connections: ["m4_n11", "n12", "m4_n13"] },
  { id: "m4_n13", x: 500, y: 550, zone: "downtown", connections: ["m4_n12", "n13", "m4_n14"] },
  { id: "m4_n14", x: 650, y: 550, zone: "industrial", connections: ["m4_n13", "n14", "m4_end"] },
  { id: "m4_end", x: 850, y: 550, zone: "industrial", connections: ["m4_n14", "n15"] },
];

// Simplified node list for pathfinding (unique nodes only)
export const PATHFINDING_NODES: RoadNode[] = [
  { id: "n1", x: 200, y: 150, zone: "residential", connections: ["n2", "n6"] },
  { id: "n2", x: 350, y: 150, zone: "residential", connections: ["n1", "n3", "n7"] },
  { id: "n3", x: 500, y: 150, zone: "downtown", connections: ["n2", "n4", "n8"] },
  { id: "n4", x: 650, y: 150, zone: "commercial", connections: ["n3", "n5", "n9"] },
  { id: "n5", x: 800, y: 150, zone: "commercial", connections: ["n4", "n10"] },
  { id: "n6", x: 200, y: 300, zone: "residential", connections: ["n1", "n7", "n11"] },
  { id: "n7", x: 350, y: 300, zone: "downtown", connections: ["n2", "n6", "n8", "n12"] },
  { id: "n8", x: 500, y: 400, zone: "downtown", connections: ["n3", "n7", "n9", "n13"] },
  { id: "n9", x: 650, y: 300, zone: "commercial", connections: ["n4", "n8", "n10", "n14"] },
  { id: "n10", x: 800, y: 300, zone: "commercial", connections: ["n5", "n9", "n15"] },
  { id: "n11", x: 200, y: 550, zone: "waterfront", connections: ["n6", "n12", "n16"] },
  { id: "n12", x: 350, y: 550, zone: "waterfront", connections: ["n7", "n11", "n13"] },
  { id: "n13", x: 500, y: 550, zone: "downtown", connections: ["n8", "n12", "n14"] },
  { id: "n14", x: 650, y: 550, zone: "industrial", connections: ["n9", "n13", "n15"] },
  { id: "n15", x: 800, y: 550, zone: "industrial", connections: ["n10", "n14"] },
  { id: "n16", x: 150, y: 650, zone: "airport", connections: ["n11"] },
];

// Calculate distance between two points
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Find nearest node to a given position
export function findNearestNode(x: number, y: number): RoadNode | null {
  let nearest: RoadNode | null = null;
  let minDistance = Infinity;

  for (const node of PATHFINDING_NODES) {
    const dist = calculateDistance(x, y, node.x, node.y);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = node;
    }
  }

  return nearest;
}

// Dijkstra's algorithm for shortest path
export function dijkstra(startId: string, endId: string): string[] {
  const nodes = PATHFINDING_NODES;
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const unvisited = new Set<string>();

  // Initialize
  for (const node of nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }
  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId: string | null = null;
    let minDist = Infinity;
    for (const id of unvisited) {
      if (distances[id] < minDist) {
        minDist = distances[id];
        currentId = id;
      }
    }

    if (currentId === null || currentId === endId) break;

    unvisited.delete(currentId);
    const currentNode = nodes.find((n) => n.id === currentId);
    if (!currentNode) continue;

    // Update distances to neighbors
    for (const neighborId of currentNode.connections) {
      if (!unvisited.has(neighborId)) continue;

      const neighbor = nodes.find((n) => n.id === neighborId);
      if (!neighbor) continue;

      const dist = calculateDistance(currentNode.x, currentNode.y, neighbor.x, neighbor.y);
      const alt = distances[currentId] + dist;

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endId;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  // If no path found, return empty
  if (path.length === 1 && path[0] !== startId) {
    return [];
  }

  return path;
}

// Linear interpolation
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * Math.min(Math.max(t, 0), 1);
}

// Calculate heading angle in degrees
export function calculateHeading(fromX: number, fromY: number, toX: number, toY: number): number {
  return Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
}

// Get node by ID
export function getNodeById(id: string): RoadNode | undefined {
  return PATHFINDING_NODES.find((n) => n.id === id);
}

// Generate a random route between two random nodes
export function generateRandomRoute(): { start: string; end: string; path: string[] } {
  const nodes = PATHFINDING_NODES;
  const startNode = nodes[Math.floor(Math.random() * nodes.length)];
  let endNode = nodes[Math.floor(Math.random() * nodes.length)];
  
  // Ensure different start and end
  while (endNode.id === startNode.id) {
    endNode = nodes[Math.floor(Math.random() * nodes.length)];
  }

  const path = dijkstra(startNode.id, endNode.id);
  return { start: startNode.id, end: endNode.id, path };
}
