"use server";
import { db } from "@/libs/db"; // Import the Prisma database instance.
import { currentUser } from "@/libs/auth"; // Function to get the currently authenticated user.

/**
 * Fetches the user's notes on BeamsToday content.
 * 
 * @returns An array of user notes on BeamsToday content.
 * @throws Throws an error if the user is not authenticated or if there is a database error.
 */
export const getUserNotes = async () => {
  const user = await currentUser(); // Retrieve the current user.

  if (!user || !user.id) {
    throw new Error("User not authenticated or missing user ID");
  }

  try {
    // Retrieve the user's notes from the database, including the associated BeamsToday items.
    const notes = await db.beamsTodayUserNote.findMany({
      where: { userId: user.id }, // Filter by the current user's ID.
      include: { beamsToday: true }, // Include the related BeamsToday items.
    });
    return notes;
  } catch (error) {
    throw new Error(`Error fetching user notes: ${(error as Error).message}`);
  }
};
