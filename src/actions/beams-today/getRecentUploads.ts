"use server";
import { db } from "@/libs/db"; // Import the Prisma database instance.
import { getTopicOfTheDay } from "./getTopicOfTheDay"; // Assuming this is where the "Topic of the Day" logic is implemented.

/**
 * Fetches recent BeamsToday video uploads, excluding the "Topic of the Day".
 * Returns the 5 most recent videos uploaded before the provided date.
 * 
 * @param clientDate - The date provided by the client. Only videos uploaded before this date will be returned.
 * @returns A list of the 5 most recent videos (excluding the "Topic of the Day"), including the ID, thumbnail, title, upload date, and category.
 * @throws Throws an error if there is a database issue while fetching recent uploads.
 */
export const getRecentUploads = async (clientDate: string) => {
  const today = new Date(clientDate); // Parse the client-provided date into a JavaScript Date object.
  today.setUTCHours(0, 0, 0, 0); // Ensure the time is set to midnight UTC to avoid timezone issues.

  try {
    // Fetch the "Topic of the Day" to exclude it from the recent uploads
    const topicOfTheDay = await getTopicOfTheDay(clientDate);

    // Fetch the 5 most recent videos uploaded before the current date and excluding the "Topic of the Day"
    const recentVideos = await db.beamsToday.findMany({
      where: {
        AND: [
          {
            date: {
              lt: today, // Only select videos with a date before the provided client date
            },
          },
          {
            id: {
              not: topicOfTheDay?.id, // Exclude the "Topic of the Day"
            },
          },
          {
            published: true, // Only include published videos
          },
        ],
      },
      orderBy: {
        date: 'desc', // Order the results by date in descending order (newest first)
      },
      take: 5, // Limit the results to the next 5 most recent topics
      select: {
        id: true, // Select only the ID of the video
        thumbnailUrl: true, // Select the thumbnail URL of the video
        title: true, // Select the title of the video
        date: true, // Select the upload date of the video
        category: true, // Select the category of the video
      },
    });

    return recentVideos; // Return the list of recent videos
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query
    throw new Error(`Error fetching recent uploads: ${(error as Error).message}`);
  }
};
