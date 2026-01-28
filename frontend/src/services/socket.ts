import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
});

export const useRealTimeMetrics = (callback: (data: any) => void) => {
    const onMetricsUpdate = (data: any) => {
        callback(data);
    };

    socket.on("metrics_update", onMetricsUpdate);

    return () => {
        socket.off("metrics_update", onMetricsUpdate);
    };
};
