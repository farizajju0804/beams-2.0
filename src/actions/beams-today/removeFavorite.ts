"use server";

import { db } from "@/libs/db"; // Import the Prisma database instance.
import { currentUser } from "@/libs/auth"; // Import the function to get the currently authenticated user.

/**
 * Removes a favorite BeamsToday item for the authenticated user.
 * 
 * @param favoriteId - The ID of the favorite item to remove.
 * @throws Throws an error if the user is not authenticated or if there is an issue with the database.
 */
export const removeFavorite = async (favoriteId: string) => {
  const user = await currentUser(); // Retrieve the current authenticated user.

  if (!user) {
    throw new Error("User not authenticated"); // Throw an error if the user is not authenticated.
  }

  try {
    // Attempt to delete the favorite item for the authenticated user.
    await db.beamsTodayFavorite.delete({
      where: {
        id: favoriteId, // The ID of the favorite item to delete.
        userId: user.id, // Ensure the favorite belongs to the authenticated user.
      },
    });
  } catch (error) {
    // Catch any errors that occur during the deletion process and throw a descriptive error message.
    throw new Error(`Error removing favorite: ${(error as Error).message}`);
  }
};
