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
    const now = start ? new Date(start) : new Date();
    console.log("Current time:", now.toISOString());
    console.log("User Type:", userType);

    // Find the most recent end date for completed weeks
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

    console.log("Most recent end date result:", mostRecentEndDateResult);

    if (!mostRecentEndDateResult) {
      console.log("No completed weeks found");
      return [];
    }

    const mostRecentEndDate = mostRecentEndDateResult.endDate;
    console.log("Most recent end date:", mostRecentEndDate.toISOString());

    // Fetch the top 3 entries for that end date
    const top3Entries = await db.leaderboard.findMany({
      where: {
        endDate: mostRecentEndDate,
        userType,
      },
      orderBy: {
        rank: 'asc', // Order by existing rank
      },
      take: 3,
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

    // Return the entries as they are, since they already match the LeaderboardEntry interface
    return top3Entries;
  } catch (error) {
    console.error("Error in getTop3EntriesForMostRecentWeek:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};