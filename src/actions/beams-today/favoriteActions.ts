'use server'; // Indicates that the code runs on the server side.

import { db } from "@/libs/db"; // Import the Prisma database instance.
import { currentUser } from "@/libs/auth"; // Function to retrieve the currently authenticated user.

/**
 * Toggles the favorite status for a specific BeamsToday topic for the current user.
 * If the topic is already favorited, it removes it from the user's favorites.
 * If the topic is not favorited, it adds it to the user's favorites.
 * 
 * @param beamsTodayId - The ID of the BeamsToday topic to toggle favorite status for.
 * @throws Throws an error if the user is not authenticated or if there is a database error.
 */
export const toggleFavorite = async (beamsTodayId: string) => {
  const user = await currentUser(); // Retrieve the current user.

  if (!user || !user.id) {
    // If no user is found or the user ID is missing, throw an authentication error.
    throw new Error('User not authenticated or missing user ID');
  }

  // Check if the topic is already in the user's favorites.
  const existingFavorite = await db.beamsTodayFavorite.findUnique({
    where: {
      userId_beamsTodayId: {
        userId: user.id, // Match the user ID.
        beamsTodayId: beamsTodayId, // Match the BeamsToday topic ID.
      },
    },
  });

  if (existingFavorite) {
    // If the topic is already favorited, remove it from the user's favorites.
    await db.beamsTodayFavorite.delete({
      where: {
        id: existingFavorite.id, // Use the favorite record's ID for deletion.
      },
    });
  } else {
    // If the topic is not already favorited, add it to the user's favorites.
    await db.beamsTodayFavorite.create({
      data: {
        userId: user.id, // Associate the favorite with the user's ID.
        beamsTodayId: beamsTodayId, // Associate the favorite with the BeamsToday topic ID.
      },
    });
  }
};

/**
 * Checks if a specific BeamsToday topic is favorited by the current user.
 * 
 * @param beamsTodayId - The ID of the BeamsToday topic to check.
 * @returns A boolean value indicating whether the topic is favorited by the user.
 * @throws Returns false if the user is not authenticated.
 */
export const isFavoriteBeamsToday = async (beamsTodayId: string) => {
  const user = await currentUser(); // Retrieve the current user.

  if (!user || !user.id) {
    // If no user is found or the user ID is missing, return false (not favorited).
    return false;
  }

  // Check if the topic is in the user's favorites.
  const existingFavorite = await db.beamsTodayFavorite.findUnique({
    where: {
      userId_beamsTodayId: {
        userId: user.id, // Match the user ID.
        beamsTodayId: beamsTodayId, // Match the BeamsToday topic ID.
      },
    },
  });

  // Return true if the topic is favorited, otherwise return false.
  return !!existingFavorite;
};
