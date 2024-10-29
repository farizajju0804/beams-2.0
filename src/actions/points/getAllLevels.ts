'use server'; // Indicating this file is a server module
import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Fetches all levels from the database.
 * 
 * @returns A promise that resolves to an array of level objects.
 * @throws Throws an error if there is a problem with the database query.
 */
export const getAllLevels = async (): Promise<any[]> => {
  try {
    // Fetch all records from the 'level' table.
    const levels = await db.level.findMany({
      // Additional query parameters can be added here if needed
    });
    return levels; // Return the fetched levels.
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching levels: ${(error as Error).message}`);
  }
};

/**
 * Fetches the user's beam points and associated level from the database.
 * If the user does not have any beam points, returns default values.
 * 
 * @param userId - The ID of the user for whom to fetch beam points and level.
 * @returns A promise that resolves to an object containing the user's beams and their associated level.
 * @throws Throws an error if there is a problem with the database query.
 */
export const getUserLevelAndBeams = async (userId: string): Promise<any> => {
  try {
    // Fetch the user's beam points, including their associated level.
    const beams = await db.userBeamPoints.findUnique({
      where: {
        userId: userId // Use the provided userId to find the user's beam points
      },
      include: {
        level: true // Include the level information in the response
      }
    });

    // Fetch the default level (Level 1).
    const levelDefault = await db.level.findFirst({
      where: {
        levelNumber: 1 // Condition to find the default level
      }
    });

    // If the user has beam points, return them. Otherwise, return default values.
    if (beams) {
      return beams; // Return the fetched beam points and level.
    } else {
      return {
        beams: 0, // Default beams to 0 if none are found
        level: levelDefault, // Set the default level to Level 1
      };
    }
  } catch (error) {
    // Throw an error with a descriptive message if something goes wrong during the query.
    throw new Error(`Error fetching user level and beams: ${(error as Error).message}`);
  }
};
