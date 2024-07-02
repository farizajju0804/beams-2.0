'use client'
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button"

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {session?.user?.name}!</p>
      <Button
        onClick={async () => {
          await signOut({ redirectTo: "/auth/login" });
        }}
        className="bg-red-500 text-white p-2 mt-4 w-full"
      >
        Sign Out
      </Button>
    </div>
  );
}
