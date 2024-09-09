"use server";

import { db } from "@/libs/db"; // Import the Prisma database instance.
import { currentUser } from "@/libs/auth"; // Import the function to get the currently authenticated user.

/**
 * Removes a BeamsToday note created by the authenticated user.
 * 
 * @param noteId - The ID of the note to remove.
 * @throws Throws an error if the user is not authenticated or if there is a database issue.
 */
export const removeNote = async (noteId: string) => {
  const user = await currentUser(); // Retrieve the current authenticated user.

  if (!user) {
    throw new Error("User not authenticated"); // Throw an error if the user is not authenticated.
  }

  try {
    // Attempt to delete the user's note from the database.
    await db.beamsTodayUserNote.delete({
      where: {
        id: noteId, // The ID of the note to delete.
        userId: user.id, // Ensure the note belongs to the authenticated user.
      },
    });
  } catch (error) {
    // Catch any errors that occur during the deletion process and throw a descriptive error message.
    throw new Error(`Error removing note: ${(error as Error).message}`);
  }
};
