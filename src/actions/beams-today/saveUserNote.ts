'use server';

import { db } from "@/libs/db"; // Import the Prisma database instance.
import { currentUser } from "@/libs/auth"; // Import the function to retrieve the currently authenticated user.

/**
 * Fetches the note created by the authenticated user for a specific BeamsToday item.
 * 
 * @param beamsTodayId - The ID of the BeamsToday item.
 * @returns The user's note for the BeamsToday item, or null if no note exists.
 * @throws Throws an error if the user is not authenticated.
 */
export const getNote = async (beamsTodayId: string) => {
  const user = await currentUser(); // Retrieve the currently authenticated user.

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID'); // Throw an error if the user is not authenticated.
  }

  // Retrieve the user's note for the specified BeamsToday item.
  const note = await db.beamsTodayUserNote.findFirst({
    where: {
      userId: user.id, // Ensure the note belongs to the authenticated user.
      beamsTodayId: beamsTodayId, // Filter by the specific BeamsToday item.
    },
  });

  return note; // Return the note, or null if no note exists.
};

/**
 * Saves or updates a note created by the authenticated user for a specific BeamsToday item.
 * If the note already exists, it is updated. Otherwise, a new note is created.
 * 
 * @param beamsTodayId - The ID of the BeamsToday item.
 * @param note - The content of the note to be saved.
 * @throws Throws an error if the user is not authenticated or if there is a database issue.
 */
export const saveNote = async (beamsTodayId: string, note: string) => {
  const user = await currentUser(); // Retrieve the currently authenticated user.

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID'); // Throw an error if the user is not authenticated.
  }

  try {
    // Check if a note already exists for this user and BeamsToday item.
    const existingNote = await db.beamsTodayUserNote.findFirst({
      where: {
        userId: user.id, // Ensure the note belongs to the authenticated user.
        beamsTodayId: beamsTodayId, // Filter by the specific BeamsToday item.
      },
    });

    if (existingNote) {
      // If a note exists, update the content of the note.
      await db.beamsTodayUserNote.update({
        where: { id: existingNote.id },
        data: { note }, // Update the note content.
      });
    } else {
      // If no note exists, create a new one.
      await db.beamsTodayUserNote.create({
        data: {
          userId: user.id, // Associate the new note with the authenticated user.
          note, // Set the note content.
          beamsTodayId: beamsTodayId, // Associate the note with the specific BeamsToday item.
        },
      });
    }
  } catch (error) {
    // Catch any errors that occur during the note saving process and throw a descriptive error message.
    throw new Error(`Error saving note: ${(error as Error).message}`);
  }
};
