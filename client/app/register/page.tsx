"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
            await register(name, email, password);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
            <h1 className="text-2xl font-bold">Create account</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <input className="rounded border p-2" placeholder="Name" value={name}
                    onChange={(e) => setName(e.target.value)} required />
                <input className="rounded border p-2" type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required />
                <input className="rounded border p-2" type="password" placeholder="Password (8+ characters)"
                    value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button disabled={busy} className="rounded bg-black p-2 text-white disabled:opacity-50">
                    {busy ? "Creating..." : "Create account"}
                </button>
            </form>
            <p className="text-sm">
                Already have an account? <Link href="/login" className="underline">Log in</Link>
            </p>
        </main>
    );
}