'use server';
import { db } from '@/libs/db';
import { UserType } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

export interface User {
    id: string;
    image: string | null;
    firstName: string | null;
    lastName: string | null;
  }
  
  export interface LeaderboardEntry {
    id: string;
    userId: string;
    points: number;
    rank: number;
    user: User | null; // Ensure user is always present
  }

  export const getTop3EntriesForMostRecentWeek = async ( userType: UserType,start?:string,): Promise<LeaderboardEntry[]> => {
    // Step 1: Find the most recent end date for completed weeks
  const now =  start ? new Date(start) : new Date()
  // const now =   new Date()
    
    const mostRecentEndDateResult = await db.leaderboard.findFirst({
      where: {
        endDate: {
          lt: now,
        },
        userType,
      },
      orderBy: {
        endDate: 'desc', // Get the most recent end date
      },
      select: {
        endDate: true, // Only select the end date
      },
    });
  
    if (!mostRecentEndDateResult) {
      return []; // No completed weeks found
    }
  
    const mostRecentEndDate = mostRecentEndDateResult.endDate;
  
    // Step 2: Fetch the top 3 entries for that end date
    const top3Entries = await db.leaderboard.findMany({
      where: {
        endDate: mostRecentEndDate,
        userType,
      },
      orderBy: {
        rank: 'asc', // Order by rank
      },
      take: 3, // Get top 3 entries
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
  
    return top3Entries;
  };
  