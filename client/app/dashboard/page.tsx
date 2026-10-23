"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.replace("/login");
    }, [loading, user, router]);

    if (loading || !user) return <p className="p-6">Loading...</p>

    return (
        <main className="mx-auto max-w-3xl p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Hi, {user.name}</h1>
                <button
                    onClick={() => { logout(); router.push("/login"); }}
                    className="rounded border px-3 py-1 text-sm"
                >
                    Log out
                </button>
            </div>
            <p className="mt-4 text-gray-600">Your trips will appear here.</p>
        </main>
    );
}