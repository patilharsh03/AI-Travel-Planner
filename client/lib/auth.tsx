"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

type User = { id: string; name: string; email: string };
type AuthResponse = { token: string; user: User };

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // On page load: if a token exists, ask the server who it belongs to
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setLoading(false);
            return;
        }
        api<{ user: User }>("/api/auth/me")
            .then((data) => setUser(data.user))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const data = await api<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }

    async function register(name: string, email: string, password: string) {
        const data = await api<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}