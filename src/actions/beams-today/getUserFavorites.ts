"use server";
import { db } from "@/libs/db"; // Import the Prisma database instance.
import { currentUser } from "@/libs/auth"; // Function to get the currently authenticated user.

/**
 * Fetches the list of BeamsToday favorites for the current user.
 * 
 * @returns An array of the user's favorite BeamsToday items.
 * @throws Throws an error if the user is not authenticated or if there is a database error.
 */
export const getUserFavorites = async () => {
  const user = await currentUser(); // Retrieve the current user.

  if (!user || !user.id) {
    throw new Error("User not authenticated or missing user ID");
  }

  try {
    // Retrieve the user's favorite BeamsToday items from the database.
    const favorites = await db.beamsTodayFavorite.findMany({
      where: { userId: user.id }, // Filter by the current user's ID.
      include: { beamsToday: true }, // Include the related BeamsToday items.
    });
    return favorites;
  } catch (error) {
    throw new Error(`Error fetching user favorites: ${(error as Error).message}`);
  }
};
