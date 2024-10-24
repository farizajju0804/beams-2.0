'use server';


import { db } from "@/libs/db";

/**
 * Fetches the user's level, beams, and recent activities with accumulated points by source.
 *
 * @returns {Promise<any>} An object containing user level, beams, and recent activity data.
 */
export const getUserLevelAndHistory = async (userId:string) => {
  try {
  

    // Fetch the user's beam points and level
    const userBeamPoints = await db.userBeamPoints.findUnique({
      where: { userId: userId },
      include: {
        level: true, // Get the level information (name, number, minPoints, maxPoints)
      },
    });
    
    // Fetch recent activity history for the user
    const recentActivities = await db.beamPointsHistory.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }, // Order by most recent activity
      select: {
        source: true,
        points: true,
        description: true,
        createdAt: true,
      }
    });
    const top20RecentActivities = recentActivities.slice(0, 20);

    // Accumulate points based on source
    const accumulatedPoints = recentActivities.reduce((acc: any, activity) => {
      const { source, points } = activity;
      if (!acc[source]) {
        acc[source] = 0;
      }
      acc[source] += points;
      return acc;
    }, {});


    const levelDefault = await db.level.findFirst({
      where : {
        levelNumber :  1
      }
    })
    return {
      userLevel: userBeamPoints?.level || { levelNumber: levelDefault?.levelNumber, icon : levelDefault?.icon, bgColor: levelDefault?.bgColor, minPoints : levelDefault?.minPoints,name: levelDefault?.name, maxPoints: levelDefault?.maxPoints }, // Default to level 1
      beams: userBeamPoints?.beams || 0, // Total beams (points)
      recentActivities, // Recent activities in descending order
      top20RecentActivities,
      accumulatedPoints, // Accumulated points by source
    };
  } catch (error) {
    console.error("Error fetching user level and history:", error);
    throw new Error("Error fetching user level and history");
  }
};
