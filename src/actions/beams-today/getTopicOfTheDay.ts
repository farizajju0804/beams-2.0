"use server"; // Indicates that this code runs on the server side.

import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Fetches the "Topic of the Day" BeamsToday video based on the client-provided date.
 * The date is converted to midnight UTC to ensure the correct date is matched.
 * 
 * @param clientDate - The date provided by the client as a string. 
 *                     The function will look for a video that matches this date.
 * @returns The video that matches the given date, including its related category.
 * @throws Throws an error if no video is found or if there is an issue with the database query.
 */
export const getTopicOfTheDay = async (clientDate: string) => {
  const today = new Date(clientDate); // Parse the client-provided date into a Date object.
  today.setUTCHours(0, 0, 0, 0); // Set the time to midnight UTC to match videos by date only.

  try {
    // Retrieve the video with a matching date from the 'beamsToday' table.
    const video = await db.beamsToday.findUnique({
      where: { date: today }, // Find a video that matches the provided date (in UTC).
      include: {
        category: true, // Include the related category in the result.
      },
    });

    return video; // Return the found video, or null if no video is found.
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching video: ${(error as Error).message}`);
  }
};
