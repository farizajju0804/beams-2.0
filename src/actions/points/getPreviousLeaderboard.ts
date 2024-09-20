'use server';
import { db } from '@/libs/db';
import { UserType } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

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
    user: User | null; // Ensure user is always present
  }

  export const getTop3EntriesForMostRecentWeek = async (
    userType: UserType,
    start?: string,
  ): Promise<LeaderboardEntry[]> => {
    const now = start ? new Date(start) : new Date();
    console.log("Current time:", now.toISOString());
  
    // Find the most recent end date for completed weeks
    const mostRecentEndDateResult = await db.leaderboard.findFirst({
      where: {
        endDate: {
          lte: now, // Changed from lt to lte
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
    // Step 2: Fetch the top 3 entries for that end date
    const top3Entries = await db.leaderboard.findMany({
      where: {
        endDate: mostRecentEndDate,
        userType,
      },
      orderBy: {
        rank: 'asc', // Order by rank
      },
      take: 3, // Get top 3 entries
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
  
    return top3Entries;
  };
  