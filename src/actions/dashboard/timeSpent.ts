'use server';

import { db } from "@/libs/db";

/**
 * Fetches analytics data for a specific user by their user ID.
 *
 * This function retrieves user analytics from the database for the provided user ID.
 * It returns the user's analytics data if found; otherwise, it will return null.
 *
 * @param userId - The ID of the user whose analytics data is to be fetched.
 * @returns {Promise<Object | null>} A promise that resolves to the user analytics object,
 *                                   or null if no analytics data is found for the user.
 * @throws {Error} Throws an error if fetching user analytics fails due to a database error.
 */
export const getUserAnalyticsById = async (userId: string) => {
  try {
    // Fetch user analytics based on the user ID
    const userAnalytics = await db.beamsTodayUserAnalytics.findUnique({
      where: {
        userId: userId // Condition to find analytics for the specified user
      }
    });
    
    return userAnalytics; // Return the user analytics data or null if not found
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw new Error("Error fetching user analytics"); // Throw an error if there is a problem
  }
};
