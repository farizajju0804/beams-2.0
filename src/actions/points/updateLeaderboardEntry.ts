"use server";
import { db } from '@/libs/db';
import { startOfWeek, endOfWeek } from 'date-fns';

export const updateLeaderboardEntry = async (userId: string, points: number) => {
  // Calculate current week start and end dates
  const now = new Date(); // Current server date
const startDate = startOfWeek(now, { weekStartsOn: 1 });
const endDate = endOfWeek(now, { weekStartsOn: 1 });

// Adjust to start of the day for startDate
startDate.setHours(0, 0, 0, 0); // Set to midnight in local time

// Adjust to end of the day for endDate
endDate.setHours(23, 59, 59, 999); // Set to the last millisecond of the day in local time

// Convert to UTC for storing in the database
const startDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
const endDateUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

// Log in ISO format
console.log(`Start Date (ISO): ${startDateUTC.toISOString()}`);
console.log(`End Date (ISO): ${endDateUTC.toISOString()}`);

  // Fetch existing leaderboard entry for the user
  const leaderboardEntry = await db.leaderboard.findFirst({
    where: {
      userId,
      startDate: startDateUTC,
      endDate: endDateUTC,
    },
  });

  if (leaderboardEntry) {
    // Update points for existing entry
    await db.leaderboard.update({
      where: { id: leaderboardEntry.id }, // Use the id of the found entry
      data: {
        points: { increment: points },
      },
    });
  } else {
    // Create a new leaderboard entry
    await db.leaderboard.create({
      data: {
        userId,
        points,
        startDate: startDateUTC,
        endDate: endDateUTC,
      },
    });
  }

  // Recalculate ranks after updating
  await recalculateLeaderboardRanks(startDateUTC, endDateUTC);
};

const recalculateLeaderboardRanks = async (startDate: Date, endDate: Date) => {
  const leaderboardEntries = await db.leaderboard.findMany({
    where: {
      startDate,
      endDate,
    },
    orderBy: {
      points: 'desc',
    },
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
