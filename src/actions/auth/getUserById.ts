'use server'; // Indicates that this code runs on the server

import { db } from '@/libs/db'; // Import the database instance from the db library

/**
 * Fetches a user from the database by their unique ID.
 * @param {string} id - The unique ID of the user to fetch.
 * @returns {Promise<Object | null>} The user object if found, otherwise null.
 * @throws Will throw an error if the Prisma query fails.
 */
export const getUserById = async (id: string) => {
  try {
    // Execute the Prisma query to find the user by their unique ID
    const user = await db.user.findUnique({
      where: { id }, // Find user by ID
    });

    console.log("Prisma query successful"); // Log success for debugging purposes
    return user; // Return the found user object
  } catch (error) {
    console.error("Prisma query failed:", error); // Log the error message for debugging purposes
    throw error; // Rethrow the error to be handled by the calling function
  }
};
