'use server';
import { db } from "@/libs/db";

/**
 * Fetches the BeamsToday content that a user has watched based on their completed content IDs.
 *
 * This function retrieves the IDs of the BeamsToday content that the user has completed.
 * If no watched content exists for the user, it returns an empty array.
 *
 * @param userId - The ID of the user whose watched content is to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of BeamsToday content objects
 *                           that the user has completed, or an empty array if none exist.
 * @throws {Error} Throws an error if fetching watched content fails due to a database error.
 */
export const getWatchedBeamsTodayContent = async (userId: string) => {
  try {
    // Fetch the watched content for the user
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true }  // Only fetch completed content IDs
    });

    // If no watched content exists, return an empty array instead of throwing an error
    if (!watchedContent || watchedContent.completedBeamsToday.length === 0) {
      return [];  // Return empty array if there's no watched content
    }

    // Fetch all BeamsToday content that matches the IDs in completedBeamsToday
    const beamsTodayContent = await db.beamsToday.findMany({
      where: {
        id: { in: watchedContent.completedBeamsToday } // Filter by completed content IDs
      }
    });

    return beamsTodayContent; // Return the fetched BeamsToday content
  } catch (error) {
    console.error("Error fetching watched BeamsToday content:", error);
    throw new Error("Error fetching watched BeamsToday content"); // Throw an error if there is a problem
  }
};
