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

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  startDate: Date;
  endDate: Date;
}

export const getTop3EntriesForMostRecentWeek = async (
  userType: UserType,
  start?: string,
): Promise<LeaderboardResult> => {
  try {
    const baseDate = start ? new Date(start) : new Date();
    const now = new Date(baseDate.getTime() + 60 * 1000);

    // Find the most recent end date for completed weeks
    const mostRecentWeek = await db.leaderboard.findFirst({
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
        startDate: true,
        endDate: true,
      },
    });

    if (!mostRecentWeek) {
      console.log("No completed weeks found");
      return { entries: [], startDate: new Date(), endDate: new Date() };
    }

    // Fetch the top 3 entries for that end date
    const top3Entries = await db.leaderboard.findMany({
      where: {
        endDate: mostRecentWeek.endDate,
        userType,
      },
      orderBy: {
        rank: 'asc',
      },
      take: 10,
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


    console.log(top3Entries)
    return {
      entries: top3Entries,
      startDate: mostRecentWeek.startDate,
      endDate: mostRecentWeek.endDate,
    };
  } catch (error) {
    console.error("Error in getTop3EntriesForMostRecentWeek:", error);
    throw error;
  }
};