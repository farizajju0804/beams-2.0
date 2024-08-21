'use client'

import { LoginButton } from "@/components/auth/login-button";
export default function Home() {
  return (
    <main className="flex h-screen flex-col justify-center items-center gap-4 bg-white">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold font-display text-black drop-shadow-xl">
          Beams
        </h1>
      </div>
      <p className="text-black text-lg">Next gen Learning Platform</p>
        <LoginButton asChild />
    </main>
  );
}