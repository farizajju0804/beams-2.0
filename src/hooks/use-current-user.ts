// Import the useSession hook from next-auth to handle authentication
import { useSession } from "next-auth/react";
// Import useEffect to perform side effects in the component (e.g., updating state)
import { useEffect } from "react";
// Import custom Zustand store for user management
import { useUserStore } from "@/store/userStore";

/**
 * Custom hook to manage and retrieve the current user from the session.
 * 
 * This hook leverages NextAuth's `useSession` to access session information,
 * and Zustand's state management to store the current user data.
 * The session data is synced with Zustand's store whenever the user is authenticated.
 * 
 * @returns {object | undefined} - The current user object from Zustand's store or undefined if not authenticated.
 */
export const useCurrentUser = () => {
  // Destructure the session and status from useSession to get the current session data and its state
  const { data: session, status } = useSession(); 

  // Zustand's setter to update the user in the global state
  const setUser = useUserStore((state) => state.setUser);

  // Zustand's getter to access the current user from the store
  const user = useUserStore((state) => state.user);

  // useEffect runs when the component mounts or when dependencies (session, status, setUser) change
  useEffect(() => {
    // If the user is authenticated and session has a user object, update Zustand store with session's user data
    if (status === "authenticated" && session?.user) {
      setUser(session.user); // Call the Zustand action to store the user in global state
    }
  }, [session, status, setUser]); // Effect re-runs if session, status, or setUser changes

  // Return the user from Zustand's store, allowing other components to access the current user
  return user;
};
