// actions/auth/onboarding.ts
'use server'

import { db } from "@/libs/db" // Import the Prisma database connection
import { auth } from "@/auth" // Import the authentication helper
import { redirect } from 'next/navigation' // Import for redirection purposes (not used here)
import { DEFAULT_LOGIN_REDIRECT } from '@/routes' // Import the default redirect route
import { updateUserPointsAndLeaderboard } from "../points/updateUserPointsAndLeaderboard"

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
    const existingUser = await db.user.update({
      where: { id: session.user.id }, // Locate the user by their ID
      data: { onBoardingCompleted: status }, // Set the new onboarding status
    })
    

    if (existingUser.referredById) {
      const pointsAdded = 20; 
      await updateUserPointsAndLeaderboard(
        existingUser?.id,
        pointsAdded,
        'REFERRAL_BONUS', 
        `Welcome bonus"`, 
        existingUser?.userType // Referrer's user type
      );
      
      const referrer = await db.user.findUnique({
        where: { id: existingUser.referredById },
      });
    if (referrer) {
      // Update points and leaderboard for the referrer
      const updateResult = await updateUserPointsAndLeaderboard(
        referrer.id,
        pointsAdded,
        'REFERRAL', // The source for referral points
        `Referral for user, "${existingUser.firstName}"`, // Description message
        referrer.userType // Referrer's user type
      );

    }
    }
    return existingUser // Return the updated user data
  } catch (error) {
    // Log any error that occurs and return it
    console.error("Error updating onboarding status:", error);
    return error
  }
};
