"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">
        Emotional Analytics Engine
      </h1>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
        Track your team's emotional health through commit history.
        Detect burnout before it happens.
      </p>

      {isSignedIn ? (
        <Link
          href="/dashboard"
          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Go to Dashboard
        </Link>
      ) : (
        <Link
          href="/sign-in"
          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      )}
    </main>
  );
}