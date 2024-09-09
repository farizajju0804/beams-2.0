// Import the useSession hook from next-auth to manage authentication sessions
import { useSession } from "next-auth/react";

/**
 * Custom hook to get the current user's role from the session.
 * 
 * This hook leverages the useSession hook from NextAuth to access
 * the current session's data and retrieves the user's role.
 * 
 * @returns {string | undefined} - The user's role if it exists in the session, or undefined if no session is active or no role is set.
 */
export const useCurrentRole = () => {
    // Retrieve the session object from NextAuth's useSession hook
    const session = useSession();
    
    // Access the user's role from the session data and return it.
    // If there is no session or the user or role is undefined, it returns undefined.
    return session.data?.user?.role;
};
