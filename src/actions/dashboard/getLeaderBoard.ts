'use server'
import { db } from '@/libs/db';
import { getPreviousAndNextDates } from '@/utils/dateRange';
import { UserType } from '@prisma/client';
import { differenceInSeconds } from 'date-fns';
import { generateNotificationForAllUsers } from '../notifications/notifications';

export interface LeaderboardData {
  userPosition?: number | null;
  userPoints?: number;
  message?: string | null;
  startDate: string;
  endDate: string;
  remainingSeconds: number;
}

export const getLeaderboardData = async (userId: string, userType: UserType, start?: string): Promise<LeaderboardData> => {
  const { startDate, endDate } = getPreviousAndNextDates(6, start);
  const now = new Date();

  console.log(`Fetching leaderboard data from ${startDate.toISOString()} to ${endDate.toISOString()}`);

  const userEntry = await db.leaderboard.findFirst({
    where: {
      userId,
      startDate,
      endDate,
      userType,
    }
  });

  const userPosition = userEntry && userEntry.rank;
  const userPoints = userEntry ? userEntry.points : 0;

  const remainingSeconds = Math.max(differenceInSeconds(endDate, now), 0);

  return {
    userPosition,
    userPoints,
    message: userPosition ? null : "Start acclaiming beams to position yourself in the leaderboard",
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    remainingSeconds,
  };
};

export async function announceLeaderboard(userType: UserType, startDate: Date, endDate: Date) {
  const existingAnnouncement = await db.leaderboardAnnouncement.findFirst({
    where: {
      userType,
      startDate,
      endDate,
    },
  });

  if (existingAnnouncement) {
    return;
  }

  await generateNotificationForAllUsers(
    'REMINDER',
    `This week's leaderboard has been announced!`,
    '/dashboard'
  );

  await db.leaderboardAnnouncement.create({
    data: {
      userType,
      startDate,
      endDate,
    },
  });
}