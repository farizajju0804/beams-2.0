// Importing the custom authentication function from the auth module
import { auth } from "@/auth"

/**
 * Asynchronously retrieves the current user from the session.
 * 
 * This function uses the custom `auth()` function to fetch the current session.
 * It checks if the session exists and then returns the user object.
 * 
 * @returns {object | undefined} - Returns the user object if the session exists, otherwise undefined.
 */
export const currentUser = async () => {
    // Await the session data from the custom auth function
    const session = await auth();

    // Return the user object if the session exists, otherwise return undefined
    return session?.user;
}

/**
 * Asynchronously retrieves the current user's role from the session.
 * 
 * This function uses the custom `auth()` function to fetch the current session.
 * It checks if the session and user object exist and returns the user's role.
 * 
 * @returns {string | undefined} - Returns the user's role if the session exists, otherwise undefined.
 */
export const currentRole = async () => {
    // Await the session data from the custom auth function
    const session = await auth();

    // Return the user's role if the session and user object exist, otherwise return undefined
    return session?.user?.role;
}
