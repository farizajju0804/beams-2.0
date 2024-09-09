"use server"; // Indicates that this code is running on the server side.

import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Fetches a specific BeamsToday video by its unique ID from the database.
 * 
 * @param id - The unique ID of the BeamsToday video.
 * @returns The BeamsToday video with the specified ID, including related category data.
 * @throws Throws an error if the video is not found or if there is a problem with the database query.
 */
export const getBeamsTodayById = async (id: string) => {
  try {
    // Retrieve a single video from the 'beamsToday' table by its ID, including the related category.
    const video = await db.beamsToday.findUnique({
      where: { id: id }, // Find the video by its unique ID.
      include: {
        category: true, // Include related category data in the result.
      },
    });

    if (!video) {
      // If no video is found, throw an error.
      throw new Error("Video not found");
    }

    return video; // Return the retrieved video, including its category.
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching video: ${(error as Error).message}`);
  }
};
