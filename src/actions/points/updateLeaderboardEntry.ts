"use server"; // Indicates that this module should be treated as a server-side module

import { db } from '@/libs/db'; // Importing the database instance
import { getPreviousAndNextDates } from '@/utils/dateRange'; // Utility function to get date range
import { UserType } from '@prisma/client'; // Importing UserType from Prisma client

/**
 * Updates the leaderboard entry for a user by adding points. 
 * If an entry for the specified date range does not exist, it creates a new entry.
 *
 * @param userId - The unique identifier of the user.
 * @param points - The number of points to be added to the leaderboard.
 * @param userType - The type of user (e.g., admin, regular user) for filtering leaderboard entries.
 * 
 * @throws Throws an error if an issue occurs during the leaderboard entry update.
 */
export const updateLeaderboardEntry = async (userId: string, points: number, userType: UserType) => {
  const { startDate, endDate } = getPreviousAndNextDates(6); // Get date range for the past week

  console.log(`Start Date (ISO): ${startDate.toISOString()}`); // Log the start date
  console.log(`End Date (ISO): ${endDate.toISOString()}`); // Log the end date

  // Fetch existing leaderboard entry for the user
  const leaderboardEntry = await db.leaderboard.findFirst({
    where: {
      userId,
      startDate: startDate,
      endDate: endDate,
    },
  });

  if (leaderboardEntry) {
    // Update points for existing entry
    await db.leaderboard.update({
      where: { id: leaderboardEntry.id },
      data: {
        points: { increment: points }, // Increment the points for the user
      },
    });
  } else {
    // Create a new leaderboard entry
    const currentEntries = await db.leaderboard.findMany({
      where: {
        startDate: startDate,
        endDate: endDate,
        userType,
      },
    });

    const rank = currentEntries.length + 1; // Determine the rank based on current entries

    await db.leaderboard.create({
      data: {
        userId,
        points,
        startDate: startDate,
        endDate: endDate,
        rank,
        userType,
      },
    });
  }

  // Recalculate ranks after updating the leaderboard entry
  await recalculateLeaderboardRanks(startDate, endDate, userType);
};

/**
 * Recalculates the ranks of leaderboard entries based on points and updates the database.
 * 
 * @param startDate - The start date of the leaderboard period.
 * @param endDate - The end date of the leaderboard period.
 * @param userType - The type of user (e.g., admin, regular user) to filter leaderboard entries.
 * 
 * @throws Throws an error if an issue occurs during the rank recalculation.
 */
export const recalculateLeaderboardRanks = async (startDate: Date, endDate: Date, userType: UserType) => {
  // Fetch leaderboard entries for the specified date range and user type
  const leaderboardEntries = await db.leaderboard.findMany({
    where: {
      startDate,
      endDate,
      userType,
    },
    orderBy: [
      { points: 'desc' }, // Order by points descending
      { createdAt: 'asc' }, // Order by createdAt ascending (earliest first)
    ],
  });

  // Update ranks based on the new order
  await Promise.all(
    leaderboardEntries.map((entry, index) =>
      db.leaderboard.update({
        where: { id: entry.id },
        data: { rank: index + 1 }, // Set the new rank based on index
      })
    )
  );
};
