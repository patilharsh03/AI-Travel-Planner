"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("checking...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
    .then((res) => res.json())
    .then((data) => 
      setStatus(`server: ${data.status}, database: ${data.database}`)
    )
    .catch(() => setStatus("cannot reach server"));
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">AI Travel Planner</h1>
      <p className="mt-4">{status}</p>
    </main>
  );
}