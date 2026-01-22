const API_BASE_URL = "http://localhost:8080/api";

export interface SystemStatus {
    status: string;
    drivers: number;
    message: string;
}

export interface Driver {
    id: number;
    name: string;
    status: string;
    location: string;
}

export interface MetricData {
    coreEngineLoad: number;
    memoryAllocation: string;
    dispatchLatency: string;
    activeNodes: number;
    edgeDensity: string;
    status: string;
}

export interface GraphData {
    nodes: number;
    edges: number;
    zones: string[];
}

export const api = {
    async getStatus(): Promise<SystemStatus> {
        const response = await fetch(`${API_BASE_URL}/status`);
        if (!response.ok) throw new Error("Failed to fetch status");
        return response.json();
    },

    async getDrivers(): Promise<Driver[]> {
        const response = await fetch(`${API_BASE_URL}/drivers`);
        if (!response.ok) throw new Error("Failed to fetch drivers");
        const data = await response.json();
        return data.drivers;
    },

    async getMetrics(): Promise<MetricData> {
        const response = await fetch(`${API_BASE_URL}/metrics`);
        if (!response.ok) throw new Error("Failed to fetch metrics");
        return response.json();
    },

    async getGraph(): Promise<GraphData> {
        const response = await fetch(`${API_BASE_URL}/graph`);
        if (!response.ok) throw new Error("Failed to fetch graph");
        return response.json();
    },

    async requestTrip(riderId: number, pickupNode: number, dropoffNode: number) {
        const response = await fetch(`${API_BASE_URL}/trip/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ riderId, pickupNode, dropoffNode }),
        });
        if (!response.ok) throw new Error("Failed to request trip");
        return response.json();
    },

    async undoAction() {
        const response = await fetch(`${API_BASE_URL}/undo`, {
            method: "POST",
        });
        if (!response.ok) throw new Error("Failed to undo action");
        return response.json();
    },
};
