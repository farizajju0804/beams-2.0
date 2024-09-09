// Import custom authentication logic from your auth module
import { auth } from '@/auth';
// Import SessionProvider from next-auth to manage authentication sessions
import { SessionProvider } from "next-auth/react";

/**
 * SessionProviders component that wraps its children with the NextAuth SessionProvider.
 * 
 * This component ensures that the authentication session is provided to all its child components.
 * It asynchronously retrieves the session and passes it to the SessionProvider.
 * 
 * @param {React.ReactNode} children - Child components that need access to the session.
 * @returns {JSX.Element} - The session provider wrapping the children components.
 */
export async function SessionProviders({ children }: { children: React.ReactNode }) {
  // Asynchronously retrieve the current authentication session
  const session = await auth();

  // Wrap children components with the SessionProvider, passing the session as a prop
  return (
    <SessionProvider session={session}>
      {children} 
    </SessionProvider>
  );
}
