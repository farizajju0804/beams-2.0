"use server";
import { db } from '@/libs/db';
import { getPreviousAndNextDates } from '@/utils/dateRange';
import { UserType } from '@prisma/client';

export const updateLeaderboardEntry = async (userId: string, points: number, userType: UserType) => {
  const { startDate, endDate } = getPreviousAndNextDates(6);

  console.log(`Start Date (ISO): ${startDate.toISOString()}`);
  console.log(`End Date (ISO): ${endDate.toISOString()}`);

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
        points: { increment: points },
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

    const rank = currentEntries.length + 1;

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

  // Recalculate ranks after updating
  await recalculateLeaderboardRanks(startDate, endDate, userType);
};

export const recalculateLeaderboardRanks = async (startDate: Date, endDate: Date, userType: UserType) => {
  const leaderboardEntries = await db.leaderboard.findMany({
    where: {
      startDate,
      endDate,
      userType,
    },
    orderBy: [
      { points: 'desc' }, // First order by points descending
      { createdAt: 'asc' }, // Then order by createdAt ascending (earliest first)
    ],
  });

  await Promise.all(
    leaderboardEntries.map((entry, index) =>
      db.leaderboard.update({
        where: { id: entry.id },
        data: { rank: index + 1 },
      })
    )
  );
};
