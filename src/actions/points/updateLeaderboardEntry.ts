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
      // { createdAt: 'asc' }, 
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


/**
 * Recalculates ranks for the leaderboard with tie handling
 */
export const recalculateLeaderboardRanks2 = async (
  startDate: Date,
  endDate: Date,
  userType: UserType,
  tx: any = db // Default to main db instance if no transaction provided
) => {
  console.log('\n[Rank Recalculation] Starting rank recalculation...');
  console.log(`Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
  console.log(`User Type: ${userType}`);

  try {
    // Fetch all entries for ranking
    console.log('\n[Ranking] Fetching all entries...');
    const entries = await tx.leaderboard.findMany({
      where: {
        startDate,
        endDate,
        userType,
      },
      orderBy: [
        { points: 'desc' },
        { createdAt: 'asc' }, // Secondary sort by creation time for consistent ordering
      ],
      select: {
        id: true,
        userId: true,
        points: true,
        rank: true,
        createdAt: true,
      }
    });

    console.log(`[Ranking] Found ${entries.length} entries to rank`);

    // Calculate ranks with tie handling
    let currentRank = 1;
    let currentPoints = -1;
    let tieCount = 0;

    const rankedEntries = entries.map((entry:any, index:any) => {
      if (entry.points !== currentPoints) {
        // New points value, reset tie tracking
        currentRank = index + 1;
        currentPoints = entry.points;
        tieCount = 0;
      } else {
        // Same points as previous, maintain rank for tie
        tieCount++;
      }

      return {
        id: entry.id,
        userId: entry.userId,
        points: entry.points,
        oldRank: entry.rank,
        newRank: currentRank,
      };
    });

    console.log('\n[Ranking] Calculated ranks with ties:', 
      rankedEntries.map((e:any) => ({
        userId: e.userId,
        points: e.points,
        oldRank: e.oldRank,
        newRank: e.newRank,
      }))
    );

    // Perform bulk update
    console.log('\n[Bulk Update] Performing bulk rank update...');
    if(rankedEntries.length < 0){
    const bulkUpdateOp = await tx.$runCommandRaw({
      update: "Leaderboard",
      updates: rankedEntries.map((entry:any) => ({
        q: { _id: { $oid: entry.id } },
        u: { $set: { rank: entry.newRank } }
      })),
      ordered: false
    });
    console.log('[Bulk Update] Bulk update completed:', bulkUpdateOp);

  }

    // Return the updated rankings
    return {
      totalParticipants: entries.length,
      updatedRanks: rankedEntries,
      success: true
    };

  } catch (error) {
    console.error('\n[ERROR] Error in rank recalculation:', {
      error,
      startDate,
      endDate,
      userType
    });
    throw error;
  }
};

/**
 * Updates leaderboard entry and recalculates ranks
 */
export const updateLeaderboardEntry2 = async (
  userId: string,
  points: number,
  userType: UserType
) => {
  console.log(`\n[${new Date().toISOString()}] Starting leaderboard update:`);
  console.log(` User: ${userId}`);
  console.log(` Points to add: ${points}`);
  console.log(` User Type: ${userType}`);

  const { startDate, endDate } = getPreviousAndNextDates(6);
  console.log(` Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

  try {
    return await db.$transaction(async (tx) => {
      console.log(`\n[Transaction] Starting transaction`);

      // Check if entry exists
      const existingEntry = await tx.leaderboard.findFirst({
        where: {
          userId,
          startDate,
          endDate,
        },
        select: {
          id: true,
          points: true,
          rank: true,
        }
      });

      console.log('\n[Existing Entry Check]', existingEntry
        ? `Found existing entry - Current Points: ${existingEntry.points}, Rank: ${existingEntry.rank}`
        : ' No existing entry found');

      // Perform upsert
      console.log('\n[Upsert] 📝 Performing upsert operation...');
      const upsertResult = await tx.leaderboard.upsert({
        where: {
          userId_startDate_endDate_userType: {
            userId,
            startDate,
            endDate,
            userType
          }
        },
        update: {
          points: {
            increment: points
          }
        },
        create: {
          userId,
          points,
          startDate,
          endDate,
          rank: 1,
          userType,
        },
        select: {
          id: true,
          points: true,
          rank: true,
        }
      });

      console.log('[Upsert] Upsert completed:', {
        id: upsertResult.id,
        newPoints: upsertResult.points,
        currentRank: upsertResult.rank
      });

      // Recalculate ranks using the new function
      await recalculateLeaderboardRanks2(startDate, endDate, userType, tx);

      // Get final state of updated entry
      const finalEntry = await tx.leaderboard.findUnique({
        where: { id: upsertResult.id },
        select: {
          points: true,
          rank: true,
        }
      });

      console.log('\n[Final State] Update complete:', {
        finalPoints: finalEntry?.points,
        finalRank: finalEntry?.rank
      });

      return finalEntry;
    });
  } catch (error) {
    console.error('\n[ERROR] Error in leaderboard update:', {
      error,
      userId,
      points,
      userType
    });
    throw error;
  }
};