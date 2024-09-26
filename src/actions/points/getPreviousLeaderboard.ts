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
  userId: string,  // Pass userId to get the user's specific rank
  start?: string
): Promise<LeaderboardResult & { userPosition?: number, userPoints?: number }> => {
  try {
    // Log the userType, userId, and optional start date passed in
    console.log('getTop3EntriesForMostRecentWeek called with:', { userType, userId, start });

    const baseDate = start ? new Date(start) : new Date();
    const now = new Date(baseDate.getTime() + 60 * 1000);

    console.log('Base date:', baseDate);
    console.log('Current adjusted date (now):', now);

    // Find the most recent week
    const mostRecentWeek = await db.leaderboard.findFirst({
      where: { endDate: { lt: now }, userType },
      orderBy: { endDate: 'desc' },
      select: { startDate: true, endDate: true }
    });

    // Log if no week is found
    if (!mostRecentWeek) {
      console.log('No leaderboard week found');
      return { entries: [], startDate: new Date(), endDate: new Date(), userPosition: undefined, userPoints: undefined };
    }

    console.log('Most recent week found:', mostRecentWeek);

    // Fetch the top 10 entries for that week
    const top10Entries = await db.leaderboard.findMany({
      where: { endDate: mostRecentWeek.endDate, userType },
      orderBy: { rank: 'asc' },
      take: 10,  // Fetch top 10 only
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, image: true }
        }
      }
    });

    console.log('Top 10 leaderboard entries:', top10Entries);

    // Fetch the user's rank and points separately, even if they are not in the top 10
    const userEntry = await db.leaderboard.findFirst({
      where: { endDate: mostRecentWeek.endDate, userType, userId },
      select: { rank: true, points: true }
    });

    // Log the user’s rank and points if found
    if (userEntry) {
      console.log(`User ${userId} entry found:`, userEntry);
    } else {
      console.log(`User ${userId} not found in leaderboard for the most recent week`);
    }

    const userPosition = userEntry ? userEntry.rank : undefined;
    const userPoints = userEntry ? userEntry.points : undefined;

    console.log('User position:', userPosition);
    console.log('User points:', userPoints);

    return {
      entries: top10Entries,
      startDate: mostRecentWeek.startDate,
      endDate: mostRecentWeek.endDate,
      userPosition,
      userPoints
    };
  } catch (error) {
    console.error('Error in getTop3EntriesForMostRecentWeek:', error);
    throw error;
  }
};
