'use server';
import { db } from '@/libs/db';
import { getPreviousAndNextDates } from '@/utils/dateRange';
import { UserType } from '@prisma/client';
import { differenceInSeconds } from 'date-fns';

/**
 * Represents the data structure for leaderboard information.
 */

export type LeaderboardEntry = {
  userId: string;
  rank: number;
  points: number;
};

export interface LeaderboardData {
  userPosition?: number | null;  // The user's position on the leaderboard, if available.
  userPoints?: number;            // The number of points the user has accumulated.
  message?: string | null;        // A message for the user, if applicable.
  startDate: string;              // The start date of the leaderboard period.
  endDate: string;                // The end date of the leaderboard period.
  remainingSeconds: number;       // The remaining seconds until the end date.
  topEntries: LeaderboardEntry[];
}

/**
 * Fetches leaderboard data for a specific user within a specified date range.
 * 
 * This function retrieves the user's position, points, and relevant 
 * information for the leaderboard based on the user ID and user type. 
 * It calculates the remaining time until the leaderboard period ends 
 * and returns a structured data object with this information.
 * 
 * @param userId - The ID of the user for whom to fetch leaderboard data.
 * @param userType - The type of user (e.g., STUDENT, NON_STUDENT).
 * @param start - An optional start date for calculating the previous and next dates.
 * @returns A promise that resolves to a LeaderboardData object containing 
 *          the user's position, points, relevant dates, and remaining time.
 */
export const getLeaderboardData = async (userId: string, userType: UserType, start?: string): Promise<LeaderboardData> => {
  const { startDate, endDate } = getPreviousAndNextDates(6, start);
  const now = new Date();

  console.log(`Fetching leaderboard data from ${startDate.toISOString()} to ${endDate.toISOString()}`);


  // Get top 10 entries
  const topEntries = await db.leaderboard.findMany({
    where: {
      startDate,
      endDate,
      userType,
    },
    orderBy: {
      rank: 'asc',
    },
    take: 10,
  });

  const userEntry = await db.leaderboard.findUnique({
    where: {
      userId_startDate_endDate_userType: {
        userId,
        startDate,
        endDate,
        userType
      }
    },
  });

  const userPosition = userEntry && userEntry.rank; // Get user rank if entry exists.
  const userPoints = userEntry ? userEntry.points : 0; // Default to 0 points if no entry.

  const remainingSeconds = Math.max(differenceInSeconds(endDate, now), 0); // Calculate remaining seconds.

  const formattedTopEntries = topEntries.map((entry) => ({
    userId: entry.userId,
    rank: entry.rank,
    points: entry.points,
  }));


  return {
    userPosition,
    userPoints,
    message: userPosition ? null : "Start acclaiming beams to position yourself in the leaderboard", // Message if user is not ranked.
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    remainingSeconds,
    topEntries: formattedTopEntries,
  };
};
