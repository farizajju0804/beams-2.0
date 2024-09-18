'use server';
import { db } from '@/libs/db';
import { startOfWeek, endOfWeek } from 'date-fns';

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string; // Derived from firstName and lastName
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  rank: number;
  user: User | null; // Ensure user is always present
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  userPosition?: number;
  userPoints?: number; // Add userPoints to return current user's points
  message?: string | null;
  startDate?: string; // Change to string
  endDate?: string;   // Change to string
}

export const getLeaderboardData = async (userId: string): Promise<LeaderboardData> => {
  const now = new Date();
  const startDate = startOfWeek(now, { weekStartsOn: 1 });
  const endDate = endOfWeek(now, { weekStartsOn: 1 });

  const startDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
  const endDateUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

  console.log(`Fetching leaderboard entries from ${startDateUTC.toISOString()} to ${endDateUTC.toISOString()}`);

  const leaderboardEntries = await db.leaderboard.findMany({
    where: {
      startDate: startDateUTC,
      endDate: endDateUTC,
    },
    orderBy: {
      points: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (leaderboardEntries.length < 3) {
    console.log("Not enough leaderboard entries available.");
    return { entries: [], message: "Not enough data available for the leaderboard." };
  }

  const userEntry = leaderboardEntries.find(entry => entry.userId === userId);
  const userPosition = userEntry ? leaderboardEntries.findIndex(entry => entry.userId === userId) + 1 : undefined;

  console.log(`Leaderboard entries found: ${leaderboardEntries.length}`);
  if (userPosition) {
    console.log(`User with ID ${userId} is at position ${userPosition} on the leaderboard.`);
  } else {
    console.log(`User with ID ${userId} is not on the leaderboard.`);
  }

  // Map entries to include user's full name
  const entriesWithNames = leaderboardEntries.map(entry => ({
    ...entry,
    user: entry.user ? {
      id: entry.user.id,
      firstName: entry.user.firstName,
      lastName: entry.user.lastName,
      name: `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim(), // Full name for display
    } : null,
  }));

  const userPoints = userEntry ? userEntry.points : 0; // Get the current user's points

  console.log("User position:", userPosition);
  console.log("User points:", userPoints);

  return {
    entries: entriesWithNames,
    userPosition,
    userPoints, // Include userPoints in the return
    message: null,
    startDate: startDateUTC.toISOString(), // Return as ISO string
    endDate: endDateUTC.toISOString(),  
  };
};
