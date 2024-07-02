'use client'

import { LoginButton } from "@/components/auth/login-button";
export default function Home() {
  return (
    <main className="flex h-screen flex-col justify-center items-center gap-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold font-display text-white drop-shadow-xl">
          Beams
        </h1>
      </div>
      <p className="text-white text-lg">Next gen Learning Platform</p>
      <div>
        <LoginButton asChild />
      </div>
    </main>
  );
}