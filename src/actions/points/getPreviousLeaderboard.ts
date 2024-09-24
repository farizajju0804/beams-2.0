'use server';

import { db } from '@/libs/db';
import { UserType } from '@prisma/client';

export interface User {
  id: string;
  image: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  rank: number;
  user: User | null;
}

export const getTop3EntriesForMostRecentWeek = async (
  userType: UserType,
  start?: string,
): Promise<LeaderboardEntry[]> => {
  try {
    const baseDate = start ? new Date(start) : new Date();
    const now = new Date(baseDate.getTime() + 60 * 1000); // Add 2 seconds (2000 milliseconds)
    console.log("Base time:", baseDate.toISOString());
    console.log("Adjusted time:", now.toISOString());
    console.log("User Type:", userType);

    // Find the most recent end date for completed weeks
    console.log("Querying for most recent end date...");
    const mostRecentEndDateResult = await db.leaderboard.findFirst({
      where: {
        endDate: {
          lt: now,
        },
        userType,
      },
      orderBy: {
        endDate: 'desc',
      },
      select: {
        endDate: true,
      },
    });

    console.log("Most recent end date result:", JSON.stringify(mostRecentEndDateResult, null, 2));

    if (!mostRecentEndDateResult) {
      console.log("No completed weeks found");
      return [];
    }

    const mostRecentEndDate = mostRecentEndDateResult.endDate;
    console.log("Most recent end date:", mostRecentEndDate.toISOString());

    // Fetch the top 3 entries for that end date
    console.log("Querying for entries...");
    const top3Entries = await db.leaderboard.findMany({
      where: {
        endDate: mostRecentEndDate,
        userType,
      },
      orderBy: {
        rank: 'asc', // Order by existing rank
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    console.log("Top 3 entries:", JSON.stringify(top3Entries, null, 2));

    

    return top3Entries;
  } catch (error) {
    console.error("Error in getTop3EntriesForMostRecentWeek:");
    console.error(error);
    throw error; 
  }
};