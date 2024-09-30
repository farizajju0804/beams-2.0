"use server"; // Indicates that this code runs on the server side.

import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Fetches the "Topic of the Day" BeamsToday video based on the client-provided date.
 * If no topic is available for the given date, the most recent topic is fetched.
 * 
 * @param clientDate - The date provided by the client as a string. 
 *                     The function will look for a video that matches this date.
 * @returns The video that matches the given date or the most recent video if none matches.
 * @throws Throws an error if there is an issue with the database query.
 */
export const getFactOfTheDay = async (clientDate: string) => {
  const today = new Date(clientDate); // Parse the client-provided date into a Date object.
  today.setUTCHours(0, 0, 0, 0); // Set the time to midnight UTC to match videos by date only.

  try {
    // Attempt to retrieve the video with a matching date from the 'beamsToday' table.
    let fact = await db.factOfTheday.findUnique({
      where: { 
        date: today,
       }
    });

    return fact; 
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching video: ${(error as Error).message}`);
  }
};


/**
 * Marks the fact as completed for a given user.
 * 
 * @param userId - The ID of the user who completed the fact.
 * @param factId - The ID of the fact the user completed.
 * @returns A confirmation message or throws an error.
 */
export const markFactAsCompleted = async (userId: string, factId: string) => {
  try {
    // Check if the user has already completed the fact
    const existingCompletion = await db.factCompletion.findUnique({
      where: {
        factId_userId: {
          factId,
          userId,
        },
      },
    });

    if (!existingCompletion) {
      // If not already completed, create a new entry in the factCompletion table
      await db.factCompletion.create({
        data: {
          factId,
          userId,
          completed: true,
          completedAt: new Date(),
        },
      });
    } else {
      // Update the existing entry to mark as completed
      await db.factCompletion.update({
        where: {
          factId_userId: {
            factId,
            userId,
          },
        },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    return { message: "Fact marked as completed." };
  } catch (error) {
    throw new Error(`Error marking fact as completed: ${(error as Error).message}`);
  }
};



/**
 * Fetches whether the user has completed the fact of the day.
 * 
 * @param userId - The ID of the user.
 * @param factId - The ID of the fact.
 * @returns Boolean indicating whether the fact is completed.
 */
export const getFactCompletionStatus = async (userId: string, factId: string) => {
  try {
    const completion = await db.factCompletion.findUnique({
      where: {
        factId_userId: {
          factId,
          userId,
        },
      },
    });

    return completion?.completed || false;
  } catch (error) {
    throw new Error(`Error fetching completion status: ${(error as Error).message}`);
  }
};