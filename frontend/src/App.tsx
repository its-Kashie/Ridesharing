import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CityGraph from "./pages/CityGraph";
import ShortestPath from "./pages/ShortestPath";
import StateMachine from "./pages/StateMachine";
import DriverManagement from "./pages/DriverManagement";
import TripRequest from "./pages/TripRequest";
import ActiveTrips from "./pages/ActiveTrips";
import CancellationRollback from "./pages/CancellationRollback";
import Analytics from "./pages/Analytics";
import TripHistory from "./pages/TripHistory";
import SystemLogs from "./pages/SystemLogs";
import AlgorithmDocs from "./pages/AlgorithmDocs";
import TestCases from "./pages/TestCases";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./lib/auth-context";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="rideflow-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/graph" element={<CityGraph />} />
                <Route path="/shortest-path" element={<ShortestPath />} />
                <Route path="/state-machine" element={<StateMachine />} />
                <Route path="/drivers" element={<DriverManagement />} />
                <Route path="/dispatch" element={<TripRequest />} />
                <Route path="/active-trips" element={<ActiveTrips />} />
                <Route path="/rollback" element={<CancellationRollback />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/history" element={<TripHistory />} />
                <Route path="/logs" element={<SystemLogs />} />
                <Route path="/docs" element={<AlgorithmDocs />} />
                <Route path="/tests" element={<TestCases />} />
                <Route path="/team" element={<Team />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
