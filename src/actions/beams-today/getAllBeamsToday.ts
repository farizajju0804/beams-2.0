
"use server"
import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Fetches all BeamsToday videos from the database, ordered by their date in ascending order.
 * 
 * @returns A list of BeamsToday videos, ordered by date.
 * @throws Throws an error if no videos are found or if there is a problem with the database query.
 */
export const getAllBeamsToday = async () => {
  try {
    // Fetch all records from the 'beamsToday' table, ordered by date in ascending order.
    const videos = await db.beamsToday.findMany({
      where : {
        published : true
      },
      orderBy: { date: 'desc' }, // Order the videos by their date (earliest first)
      include: {
        category: true, // Include the category details
      },
    });

    if (!videos || videos.length === 0) {
      // If no videos are found, throw an error.
      throw new Error("No videos found");
    }

    return videos; // Return the fetched list of videos.
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching videos: ${(error as Error).message}`);
  }
};

/**
 * Fetches BeamsToday videos from the database, excluding the most recent 6 topics,
 * and orders the rest by their date in descending order.
 * 
 * @returns A list of BeamsToday videos, excluding the most recent 6, ordered by date in descending order.
 * @throws Throws an error if no videos are found or if there is a problem with the database query.
 */
export const getNewBeamsToday = async () => {
  try {
    // Fetch all videos, excluding the most recent 6, ordered by date in descending order.
    const videos = await db.beamsToday.findMany({
      skip: 6, // Skip the most recent 6 topics
      where : {
        published : true
      },
      orderBy: { date: 'desc' }, // Order the remaining videos by date in descending order
      include: {
        category: true, // Include the category details
      },
    });

    if (!videos || videos.length === 0) {
      // If no videos are found, throw an error.
      console.log("No videos found");
    }

    return videos; // Return the fetched list of videos in descending order.
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching videos: ${(error as Error).message}`);
  }
};
