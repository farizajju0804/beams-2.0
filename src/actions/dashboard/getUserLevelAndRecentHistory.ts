'use server';

import { db } from "@/libs/db";

/**
 * Fetches the user's level, total beams, and recent activities with accumulated points by source.
 *
 * This function retrieves the user's current beam points and level information from the database,
 * as well as their recent activity history. It also calculates accumulated points based on the 
 * activity source. If the user does not have a level assigned, it defaults to level 1.
 *
 * @param userId - The ID of the user whose level and activity history are being fetched.
 * @returns {Promise<any>} An object containing the user's level, total beams, 
 *                         recent activities, the top 20 recent activities, and 
 *                         accumulated points categorized by source.
 * @throws {Error} Throws an error if fetching user level and history fails.
 */
export const getUserLevelAndHistory = async (userId: string) => {
  try {
    // Fetch the user's beam points and associated level information
    const userBeamPoints = await db.userBeamPoints.findUnique({
      where: { userId: userId },
      include: {
        level: true, // Include the level information (name, number, minPoints, maxPoints)
      },
    });
    
    // Fetch recent activity history for the user
    const recentActivities = await db.beamPointsHistory.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // Order activities by most recent
      select: {
        source: true,
        points: true,
        description: true,
        createdAt: true,
      }
    });

    // Limit the results to the top 20 most recent activities
    const top20RecentActivities = recentActivities.slice(0, 20);

    // Accumulate points based on the source of activities
    const accumulatedPoints = recentActivities.reduce((acc: any, activity) => {
      const { source, points } = activity;
      if (!acc[source]) {
        acc[source] = 0; // Initialize accumulator for new source
      }
      acc[source] += points; // Sum points for each source
      return acc;
    }, {});

    // Fetch the default level information (level 1)
    const levelDefault = await db.level.findFirst({
      where: {
        levelNumber: 1
      }
    });

    return {
      userLevel: userBeamPoints?.level || { // Return user level or default level
        levelNumber: levelDefault?.levelNumber,
        icon: levelDefault?.icon,
        bgColor: levelDefault?.bgColor,
        minPoints: levelDefault?.minPoints,
        name: levelDefault?.name,
        maxPoints: levelDefault?.maxPoints 
      },
      beams: userBeamPoints?.beams || 0, // Total beams (points)
      recentActivities, // All recent activities in descending order
      top20RecentActivities, // Limited to the top 20 recent activities
      accumulatedPoints, // Accumulated points categorized by source
    };
  } catch (error) {
    console.error("Error fetching user level and history:", error);
    throw new Error("Error fetching user level and history"); // Throw error if any issues occur
  }
};
