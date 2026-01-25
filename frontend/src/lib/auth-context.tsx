import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "driver" | "user";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    role: UserRole;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial demo users
const DEMO_USERS: User[] = [
    { id: "admin-1", name: "System Admin", email: "admin@demo.com", role: "admin" },
    { id: "driver-1", name: "John Driver", email: "driver@demo.com", role: "driver" },
    { id: "user-1", name: "Alice Passenger", email: "user@demo.com", role: "user" },
];

const API_BASE_URL = "http://localhost:8080/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("rideflow-user");
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoading, setIsLoading] = useState(false);

    const role = user?.role || "user";

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                localStorage.setItem("rideflow-user", JSON.stringify(data));
                setIsLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Login error:", error);
        }
        setIsLoading(false);
        return false;
    };

    const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                localStorage.setItem("rideflow-user", JSON.stringify(data));
                setIsLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("rideflow-user");
    };

    return (
        <AuthContext.Provider value={{ user, role, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

