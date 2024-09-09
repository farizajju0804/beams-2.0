"use server";
import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Fetches recent BeamsToday video uploads based on a client-provided date.
 * Returns videos uploaded before the provided date, ordered by the most recent uploads.
 * 
 * @param clientDate - The date provided by the client. Only videos uploaded before this date will be returned.
 * @returns A list of recent videos, including the ID, thumbnail, title, upload date, and category.
 * @throws Throws an error if there is a database issue while fetching recent uploads.
 */
export const getRecentUploads = async (clientDate: string) => {
  const today = new Date(clientDate); // Parse the client-provided date into a JavaScript Date object.
  try {
    // Fetch videos uploaded before the client-provided date, ordered by the most recent.
    const recentVideos = await db.beamsToday.findMany({
      where: {
        date: {
          lt: today, // Only select videos with a date before the provided client date.
        },
      },
      orderBy: {
        date: 'desc', // Order the results by date in descending order (newest first).
      },
      select: {
        id: true, // Select only the ID of the video.
        thumbnailUrl: true, // Select the thumbnail URL of the video.
        title: true, // Select the title of the video.
        date: true, // Select the upload date of the video.
        category: true, // Select the category of the video.
      },
    });

    return recentVideos; // Return the list of recent videos.
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching recent uploads: ${(error as Error).message}`);
  }
};
