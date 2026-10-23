import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-bold">AI Travel Planner</h1>
      <p className="text-gray-600">
        Tell us where you want to go and when. Get a full day-by-day plan with costs.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/register" className="rounded bg-black px-4 py-2 text-white">
          Sign up
        </Link>
        <Link href="/login" className="rounded border px-4 py-2">
          Log in
        </Link>
      </div>
    </main>
  );
}