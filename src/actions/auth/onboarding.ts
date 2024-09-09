// actions/auth/onboarding.ts
'use server'

import { db } from "@/libs/db" // Import the Prisma database connection
import { auth } from "@/auth" // Import the authentication helper
import { redirect } from 'next/navigation' // Import for redirection purposes (not used here)
import { DEFAULT_LOGIN_REDIRECT } from '@/routes' // Import the default redirect route

/**
 * Updates the onboarding status of the authenticated user.
 * 
 * @param {boolean} status - The onboarding status to set (true for completed, false for not completed).
 * @returns {Promise<Object>} The updated user record or an error object.
 * @throws {Error} If the user is not authenticated or if there is a database error.
 */
export async function updateOnboardingStatus(status: boolean) {
  // Get the current session to check if the user is authenticated
  const session = await auth()

  // If no session or user is found, throw an error
  if (!session || !session.user) {
    throw new Error("Not authenticated")
  }

  try {
    // Update the `onBoardingCompleted` field in the database for the authenticated user
    const response = await db.user.update({
      where: { id: session.user.id }, // Locate the user by their ID
      data: { onBoardingCompleted: status }, // Set the new onboarding status
    })
    
    console.log(response) // Log the updated user data for debugging
    return response // Return the updated user data
  } catch (error) {
    // Log any error that occurs and return it
    console.error("Error updating onboarding status:", error);
    return error
  }
};
