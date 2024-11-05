"use server"; // Indicates that this module should be treated as a server-side module

import { db } from '@/libs/db'; // Importing the database instance
import { getPreviousAndNextDates } from '@/utils/dateRange'; // Utility function to get date range
import { UserType } from '@prisma/client'; // Importing UserType from Prisma client

interface PointGroup {
  _id: number;
  count: number;
}

type LeaderboardPeriod = {
  startDate: Date;
  endDate: Date;
  userType: UserType;
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
export const recalculateRanksForPointUpdate = async (
  period: LeaderboardPeriod,
): Promise<void> => {
  const { startDate, endDate, userType } = period;

  try {
    console.log('\n[Rank Recalculation] Starting for period:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userType
    });

    // Get all entries sorted by points
    const entries = await db.leaderboard.findMany({
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

    console.log(`[Rank Recalculation] Found ${entries.length} entries to process`);

    // Calculate ranks with dense ranking
    let currentRank = 1;  // Current rank being assigned
    let currentPoints = null;
    const updates = [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      
      // If points change, increment rank
      if (entry.points !== currentPoints) {
        if (currentPoints !== null) {
          currentRank++;
        }
        currentPoints = entry.points;
      }

      updates.push({
        id: entry.id,
        rank: currentRank,
        points: entry.points,
        userId: entry.userId
      });

      console.log(
        `Assigning rank ${currentRank} to user ${entry.userId} with ${entry.points} points`
      );
    }

    // Update ranks in batches
    const batchSize = 100;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      await Promise.all(
        batch.map(update =>
          db.leaderboard.update({
            where: { id: update.id },
            data: { rank: update.rank }
          })
        )
      );
      console.log(`[Rank Recalculation] Updated ${i + batch.length}/${updates.length} entries`);
    }

    // Log final rankings
    console.log('\n[Rank Recalculation] Final rankings:');
    updates.forEach(update => {
      console.log(`User: ${update.userId}, Points: ${update.points}, Rank: ${update.rank}`);
    });

  } catch (error) {
    console.error('Error in rank recalculation:', error);
    throw error;
  }
};


export const updateLeaderboardEntry2 = async (
  userId: string,
  points: number,
  userType: UserType
) => {
  console.log(`\n[${new Date().toISOString()}] Starting leaderboard update:`);
  console.log(` User: ${userId}`);
  console.log(` Points to add: ${points}`);
  console.log(` User Type: ${userType}`);

  const { startDate, endDate } = getPreviousAndNextDates(2);
  console.log(` Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

  try {
    // Check if period is finalized
    const announcement = await db.leaderboardAnnouncement.findUnique({
      where: {
        startDate_endDate_userType: {
          startDate,
          endDate,
          userType
        }
      }
    });

    if (announcement?.announced) {
      throw new Error('Leaderboard period has ended');
    }

    // Check existing entry
    const existingEntry = await db.leaderboard.findFirst({
      where: {
        userId,
        startDate,
        endDate,
        userType,
      },
      select: {
        id: true,
        points: true,
        rank: true,
      }
    });

    console.log('\n[Existing Entry]', existingEntry
      ? `Found - Current Points: ${existingEntry.points}, Rank: ${existingEntry.rank}`
      : 'New entry');

    // Validate points
    if (points < 0 && existingEntry && existingEntry.points + points < 0) {
      throw new Error('Points cannot go below 0');
    }

    // Update or create entry
    console.log('\n[Points Update] Processing...');
    const upsertResult = await db.leaderboard.upsert({
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
        points: Math.max(0, points),
        startDate,
        endDate,
        rank: 1,
        userType,
      },
      select: {
        id: true,
        points: true,
        userId: true
      }
    });

    console.log('[Points Update] Complete:', {
      userId: upsertResult.userId,
      newPoints: upsertResult.points
    });

    // Recalculate ranks for all entries
    await recalculateRanksForPointUpdate({ startDate, endDate, userType });

    // Get updated entry with new rank
    const finalEntry = await db.leaderboard.findUnique({
      where: { id: upsertResult.id },
      select: {
        points: true,
        rank: true,
      }
    });

    if (!finalEntry) {
      throw new Error('Failed to retrieve updated entry');
    }

    console.log('\n[Final State]', {
      points: finalEntry.points,
      rank: finalEntry.rank
    });

    return finalEntry;
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


export const finalizeLeaderboardPeriod = async (
   startDate:any, endDate:any, userType:any 
): Promise<boolean> => {
 

  try {
    console.log('\n[Finalize Period] Starting finalization:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userType
    });

    // Check for existing announcement
    const existingAnnouncement = await db.leaderboardAnnouncement.findUnique({
      where: {
        startDate_endDate_userType: {
          startDate,
          endDate,
          userType
        }
      }
    });

    if (existingAnnouncement?.announced) {
      console.log('[Finalize Period] Period already finalized');
      return false;
    }

    // Create announcement
    await db.leaderboardAnnouncement.upsert({
      where: {
        startDate_endDate_userType: {
          startDate,
          endDate,
          userType
        }
      },
      create: {
        startDate,
        endDate,
        userType,
        announced: true
      },
      update: {
        announced: true
      }
    });

    console.log('[Finalize Period] Created announcement');

    // Get all entries and recalculate final ranks
    await recalculateRanksForPointUpdate({ startDate, endDate, userType });

    console.log('[Finalize Period] Completed final rank calculation');
    return true;

  } catch (error) {
    console.error('[Finalize Period] Error:', error);
    throw error;
  }
};