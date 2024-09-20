'use server';
import { db } from '@/libs/db';
import { getPreviousAndNextDates } from '@/utils/dateRange';
import { UserType } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

export interface User {
  id: string;
  image: string | null;
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

export const getLeaderboardData = async (start:string, userId: string, userType: UserType): Promise<LeaderboardData> => {
   
  // const now2 =  start ? new Date(start) : new Date()
  const now = new Date(); // Current server date
  // const startDate = startOfWeek(now, { weekStartsOn: 5 });
  // const endDate = endOfWeek(now, { weekStartsOn: 6 });

  // console.log(now)

  // startDate.setHours(18, 0, 0, 0); 
 

  // endDate.setHours(17, 59, 59, 999);
  const {startDate , endDate } = getPreviousAndNextDates(5)
  console.log("start", startDate)
  console.log("end", endDate)

  console.log(`Fetching leaderboard entries from ${startDate.toISOString()} to ${endDate.toISOString()}`);

  // Fetch leaderboard entries based on user type passed as an argument
  const leaderboardEntries = await db.leaderboard.findMany({
    where: {
      startDate: startDate,
      endDate: endDate,
      userType, // Use the passed userType argument
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
          image: true,
        },
      },
    },
  });

  if (leaderboardEntries.length < 3) {
    console.log("Not enough leaderboard entries available.");
    return { entries: [], message: "Not enough data available for the current week's leaderboard." };
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
      image: entry.user.image,
      name: `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim(), // Full name for display
    } : null,
  }));

  const userPoints = userEntry ? userEntry.points : 0; // Get the current user's points

  return {
    entries: entriesWithNames,
    userPosition,
    userPoints, // Include userPoints in the return
    message: null,
    startDate: startDate.toISOString(), // Return as ISO string
    endDate: endDate.toISOString(),  
  };
};
