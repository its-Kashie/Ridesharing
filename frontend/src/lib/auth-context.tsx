import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "driver" | "user";

interface AuthContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRoleState] = useState<UserRole>(() => {
        const saved = localStorage.getItem("rideflow-role");
        return (saved as UserRole) || "user";
    });

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        localStorage.setItem("rideflow-role", newRole);
    };

    const logout = () => {
        setRole("user");
        localStorage.removeItem("rideflow-role");
    };

    return (
        <AuthContext.Provider value={{ role, setRole, logout }}>
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
