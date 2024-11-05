'use server'; // Indicates that this module should be treated as a server-side module

import { db } from '@/libs/db'; // Importing the database instance
import { UserType } from '@prisma/client'; // Importing UserType from Prisma client

// Interface representing a user with minimal details
export interface User {
  id: string; // Unique identifier for the user
  image: string | null; // User's profile image (nullable)
  firstName: string | null; // User's first name (nullable)
  lastName: string | null; // User's last name (nullable)
}

// Interface representing a single leaderboard entry
export interface LeaderboardEntry {
  id: string; // Unique identifier for the leaderboard entry
  userId: string; // Unique identifier for the user associated with the entry
  points: number; // Points scored by the user
  rank: number; // Rank of the user in the leaderboard
  user: User | null; // Associated user details, if available
}

// Interface representing the result of leaderboard queries
export interface LeaderboardResult {
  entries: LeaderboardEntry[]; // Array of leaderboard entries
  startDate: Date; // Start date of the leaderboard period
  endDate: Date; // End date of the leaderboard period
}

/**
 * Fetches the top 10 leaderboard entries for the most recent week.
 * Also returns the user's position and points.
 *
 * @param userType - The type of user (e.g., regular, admin) to filter the leaderboard.
 * @param userId - The ID of the user whose specific rank is to be fetched.
 * @param start - Optional start date to calculate the leaderboard period from.
 * @returns An object containing leaderboard entries, the start and end dates of the period,
 *          and optionally the user's position and points.
 * @throws Throws an error if there is an issue during the database queries.
 */
export const getTop3EntriesForMostRecentWeek = async (
  userType: UserType,
  userId: string,  // Pass userId to get the user's specific rank
  start?: string
): Promise<LeaderboardResult & { userPosition?: number; userPoints?: number }> => {
  try {
    // Log the parameters received
    console.log('getTop3EntriesForMostRecentWeek called with:', { userType, userId, start });

    const baseDate = start ? new Date(start) : new Date(); // Determine the base date for the query
    const now = new Date(baseDate.getTime() + 60 * 1000); // Adjust the current time slightly

    console.log('Base date:', baseDate);
    console.log('Current adjusted date (now):', now);

    // Find the most recent leaderboard week based on the current time
    const mostRecentWeek = await db.leaderboard.findFirst({
      where: { endDate: { lt: now }, userType }, // Filter by end date and user type
      orderBy: { endDate: 'desc' }, // Order by end date in descending order
      select: { startDate: true, endDate: true } // Select only the start and end dates
    });

    // Log if no leaderboard week is found
    if (!mostRecentWeek) {
      console.log('No leaderboard week found');
      return { entries: [], startDate: new Date(), endDate: new Date(), userPosition: undefined, userPoints: undefined };
    }

    console.log('Most recent week found:', mostRecentWeek);

    // Fetch the top 10 entries for the most recent week
    const top10Entries = await db.leaderboard.findMany({
      where: { endDate: mostRecentWeek.endDate, userType }, // Filter by the end date and user type
      orderBy: [
        { rank: 'asc' },
        { createdAt: 'asc' }
      ], // Order by rank in ascending order
      take: 10, // Limit the results to the top 10 entries
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, image: true } // Include user details
        }
      }
    });

    // console.log('Top 10 leaderboard entries:', top10Entries);

    // Fetch the user's rank and points, even if they are not in the top 10
    const userEntry = await db.leaderboard.findFirst({
      where: { endDate: mostRecentWeek.endDate, userType, userId }, // Filter by user ID
      select: { rank: true, points: true } // Select only rank and points
    });

    // Log the user’s rank and points if found
    if (userEntry) {
      console.log(`User ${userId} entry found:`, userEntry);
    } else {
      console.log(`User ${userId} not found in leaderboard for the most recent week`);
    }

    const userPosition = userEntry ? userEntry.rank : undefined; // Determine the user's position
    const userPoints = userEntry ? userEntry.points : undefined; // Determine the user's points

    console.log('User position:', userPosition);
    console.log('User points:', userPoints);

    return {
      entries: top10Entries, // Return the top entries
      startDate: mostRecentWeek.startDate, // Return the start date of the leaderboard week
      endDate: mostRecentWeek.endDate, // Return the end date of the leaderboard week
      userPosition, // Include user's position
      userPoints // Include user's points
    };
  } catch (error) {
    console.error('Error in getTop3EntriesForMostRecentWeek:', error);
    throw error; // Rethrow the error for higher-level handling
  }
};

/**
 * Fetches the top 10 leaderboard entries for the most recent week.
 * 
 * @param userType - The type of user to filter the leaderboard.
 * @param start - Optional start date to calculate the leaderboard period from.
 * @returns An object containing leaderboard entries, the start and end dates of the period.
 * @throws Throws an error if there is an issue during the database queries.
 */
export const getTop10EntriesForMostRecentWeek = async (
  userType: UserType,
  start?: string
): Promise<LeaderboardResult & { userPosition?: number; userPoints?: number }> => {
  try {
    // Log the parameters received
    console.log('getTop10EntriesForMostRecentWeek called with:', { userType, start });

    const baseDate = start ? new Date(start) : new Date(); // Determine the base date for the query
    const now = new Date(baseDate.getTime() + 60 * 1000); // Adjust the current time slightly

    console.log('Base date:', baseDate);
    console.log('Current adjusted date (now):', now);

    // Find the most recent leaderboard week based on the current time
    const mostRecentWeek = await db.leaderboard.findFirst({
      where: { endDate: { lt: now }, userType }, // Filter by end date and user type
      orderBy: { endDate: 'desc' }, // Order by end date in descending order
      select: { startDate: true, endDate: true } // Select only the start and end dates
    });

    // Log if no leaderboard week is found
    if (!mostRecentWeek) {
      console.log('No leaderboard week found');
      return { entries: [], startDate: new Date(), endDate: new Date(), userPosition: undefined, userPoints: undefined };
    }

    console.log('Most recent week found:', mostRecentWeek);

    // Fetch the top 10 entries for the most recent week
    const top10Entries = await db.leaderboard.findMany({
      where: { endDate: mostRecentWeek.endDate, userType }, // Filter by the end date and user type
      orderBy: { rank: 'asc' }, // Order by rank in ascending order
      take: 10, // Limit the results to the top 10 entries
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, image: true } // Include user details
        }
      }
    });

    console.log('Top 10 leaderboard entries:', top10Entries);

    return {
      entries: top10Entries, // Return the top entries
      startDate: mostRecentWeek.startDate, // Return the start date of the leaderboard week
      endDate: mostRecentWeek.endDate, // Return the end date of the leaderboard week
    };
  } catch (error) {
    console.error('Error in getTop10EntriesForMostRecentWeek:', error);
    throw error; // Rethrow the error for higher-level handling
  }
};
