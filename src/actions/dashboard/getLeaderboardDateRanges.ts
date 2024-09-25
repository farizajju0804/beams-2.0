'use server';

import { db } from '@/libs/db';
import { UserType } from '@prisma/client';

export const getLeaderboardDateRanges = async (userType: UserType) => {
  try {
    const now = new Date();
    
    const leaderboards = await db.leaderboard.findMany({
      where: { 
        userType,
        endDate: { lt: now } // Only fetch completed weeks
      },
      orderBy: { endDate: 'desc' },
      select: { startDate: true, endDate: true },
      distinct: ['endDate'],
      take: 10, // Limit to the last 10 completed weeks
    });

    return leaderboards.map(board => ({
      label: `${formatDate(board.startDate)} - ${formatDate(board.endDate)}`,
      value: board.endDate.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching leaderboard date ranges:", error);
    throw error;
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};