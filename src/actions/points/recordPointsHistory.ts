"use server"; // Indicates that this module should be treated as a server-side module

import { db } from '@/libs/db'; // Importing the database instance
import { PointsSource } from '@prisma/client'; // Importing PointsSource enum from Prisma client

/**
 * Records the points history for a specific user.
 * 
 * @param userId - The unique identifier of the user whose points are being recorded.
 * @param points - The number of points to be recorded in the history.
 * @param source - The source of the points, defined by the PointsSource enum.
 * @param description - A description detailing the reason for the points record (e.g., reward, achievement).
 * 
 * @returns A Promise that resolves when the points history has been successfully recorded.
 * 
 * @throws Throws an error if there is an issue during the database operation.
 */
export const recordPointsHistory = async (
  userId: string,          // Unique identifier for the user
  points: number,          // Number of points to be recorded
  source: PointsSource,    // Source of the points (e.g., activity, achievement)
  description: string       // Description for the points entry
) => {
  try {
    // Create a new entry in the beamPointsHistory table with the provided data
    await db.beamPointsHistory.create({
      data: {
        userId,        // The user ID associated with the points
        points,        // The points to be recorded
        source,        // The source of the points
        description,   // Description of the points record
      },
    });
    
    console.log(`Recorded ${points} points for user ${userId} from source ${source}: ${description}`);
  } catch (error) {
    console.error('Error recording points history:', error);
    throw error; // Rethrow the error for higher-level handling
  }
};
