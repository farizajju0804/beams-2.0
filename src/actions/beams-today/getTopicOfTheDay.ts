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
export const getTopicOfTheDay = async (clientDate: string) => {
  const today = new Date(clientDate); // Parse the client-provided date into a Date object.
  today.setUTCHours(0, 0, 0, 0); // Set the time to midnight UTC to match videos by date only.

  try {
    // Attempt to retrieve the video with a matching date from the 'beamsToday' table.
    let video = await db.beamsToday.findUnique({
      where: { 
        date: today,
        published: true, // Only fetch if the topic is published
       }, // Find a video that matches the provided date (in UTC).
      include: {
        category: true, // Include the related category in the result.
      },
    });

    // If no video is found for the given date, fetch the latest available topic.
    if (!video) {
      video = await db.beamsToday.findFirst({
        where: {
          date : {
            lt : today
          },
          published: true, // Only fetch published topics
        },
        orderBy: {
          date: 'desc', // Order by date in descending order to get the latest topic.
        },
        include: {
          category: true, // Include the related category in the result.
        },
      });
    }

    return video; // Return the found video, or null if no video is found.
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching video: ${(error as Error).message}`);
  }
};
