"use server"; // Indicates that this code runs on the server side.

import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db"; // Import the Prisma database instance.
import { date } from "zod";
import { generateNotification } from "../notifications/notifications";




/**
 * Marks the fact as completed for a given user.
 * 
 * @param userId - The ID of the user who completed the fact.
 * @param factId - The ID of the fact the user completed.
 * @returns A confirmation message or throws an error.
 */
export const markFactAsCompleted = async (userId: string, factId: string, clientDate: string) => {
  try {
    console.log(`[markFactAsCompleted] Starting process for userId: ${userId}, factId: ${factId}, clientDate: ${clientDate}`);

    // Check if the user has already completed the fact
    const existingCompletion = await db.factCompletion.findUnique({
      where: {
        factId_userId: {
          factId,
          userId,
        },
      },
    });

    if (!existingCompletion) {
      console.log(`[markFactAsCompleted] No existing completion found. Creating new completion entry for userId: ${userId}, factId: ${factId}`);

      // If not already completed, create a new entry in the factCompletion table
      await db.factCompletion.create({
        data: {
          factId,
          userId,
          completed: true,
          completedAt: new Date(),
        },
      });
      console.log(`[markFactAsCompleted] New fact completion entry created for userId: ${userId}, factId: ${factId}`);
    } else {
      console.log(`[markFactAsCompleted] Existing completion found. Updating entry for userId: ${userId}, factId: ${factId}`);

      // Update the existing entry to mark as completed
      await db.factCompletion.update({
        where: {
          factId_userId: {
            factId,
            userId,
          },
        },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
      console.log(`[markFactAsCompleted] Existing fact completion entry updated for userId: ${userId}, factId: ${factId}`);
    }

    console.log(`[markFactAsCompleted] Fact marked as completed for userId: ${userId}, factId: ${factId}`);
    
    // Update achievement progress
    const { streakDay } = await updateAchievementProgress(userId, 'Week Warrior', clientDate);

    console.log(`[markFactAsCompleted] Achievement progress updated for userId: ${userId} for achievement 'Week Warrior'`);

    return {  streakDay };
  } catch (error) {
    console.error(`[markFactAsCompleted] Error marking fact as completed for userId: ${userId}, factId: ${factId}:`, error);
    throw new Error(`Error marking fact as completed: ${(error as Error).message}`);
  }
};


async function updateAchievementProgress(userId: string, achievementName: string, clientDate: string): Promise<{ streakDay: number }> {
  const user: any = await currentUser();
  const username = user?.firstName || "User";

  try {
    console.log(`[updateAchievementProgress] Starting process for userId: ${userId}, achievementName: ${achievementName}, clientDate: ${clientDate}`);

    // Find achievement by name
    const achievement = await db.achievement.findUnique({
      where: { name: achievementName },
    });

    if (!achievement) {
      console.error(`[updateAchievementProgress] Achievement '${achievementName}' not found`);
      throw new Error(`Achievement '${achievementName}' not found`);
    }

    console.log(`[updateAchievementProgress] Found achievement '${achievementName}' with ID: ${achievement.id}`);

    // const today = new Date('2024-10-05T00:00:00.000+00:00');
    const today = new Date(clientDate);
    today.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC for comparing days

    console.log(`[updateAchievementProgress] Today's date set to ${today.toISOString()}`);

    // Check if user already has progress for this achievement
    let userAchievement = await db.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });

    // If achievement is already completed, return early
    if (userAchievement && userAchievement.completionStatus) {
      console.log(`[updateAchievementProgress] Achievement already completed for userId: ${userId}`);
      return { streakDay: userAchievement.progress };
    }

    let newProgress = 1;
    let message: string | null = null;
    let isReset = false;

    if (!userAchievement) {
      console.log(`[updateAchievementProgress] No existing achievement progress found. Creating new entry for userId: ${userId}, achievementId: ${achievement.id}`);

      userAchievement = await db.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          progress: newProgress,
          updatedAt: today,
          completionStatus: false,
        },
      });

      console.log(`[updateAchievementProgress] New achievement progress created for userId: ${userId}, achievementId: ${achievement.id}`);
    } else {
      console.log(`[updateAchievementProgress] Existing achievement progress found for userId: ${userId}, achievementId: ${achievement.id}`);

      const lastUpdated = new Date(userAchievement.updatedAt);
      lastUpdated.setUTCHours(0, 0, 0, 0);

      const dayDifference = Math.floor((today.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDifference === 1) {
        console.log(`[updateAchievementProgress] Last updated yesterday. Incrementing progress for userId: ${userId}`);
        newProgress = userAchievement.progress + 1;
      } else if (dayDifference > 1) {
        console.log(`[updateAchievementProgress] Last updated more than 1 day ago. Resetting progress for userId: ${userId}`);
        newProgress = 1;
        isReset = true;
      } else {
        console.log(`[updateAchievementProgress] Progress already updated for today for userId: ${userId}`);
        newProgress = userAchievement.progress;
      }

      const isNowCompleted = newProgress >= achievement.totalCount;

      userAchievement = await db.userAchievement.update({
        where: { id: userAchievement.id },
        data: {
          progress: newProgress,
          completionStatus: isNowCompleted,
          updatedAt: today,
        },
      });

      console.log(`[updateAchievementProgress] Achievement progress updated for userId: ${userId}, new progress: ${newProgress}, completed: ${isNowCompleted}`);


      if (isNowCompleted) {
        // Generate notification if the achievement is completed
        await generateNotification(
          userId,
          'ACHIEVEMENT',
          `Congratulations ${username}! You've unlocked the Week Warrior badge!`,
          `/achievements#${achievement.id}`
        );
      }
    

      // if (isNowCompleted) {
      //   message = `Congratulations ${username}! You've unlocked the ${achievementName} badge!`;
      // } else if (isReset) {
      //   message = `${username}, your streak reset, but don't worry. Every day is a new opportunity to build your streak!`;
      // } else {
      //   message = getStreakMessage(newProgress, username);
      // }
    }

    return { streakDay: newProgress };
  } catch (error) {
    console.error(`[updateAchievementProgress] Error updating achievement progress for userId: ${userId}, achievementName: ${achievementName}:`, error);
    throw new Error(`Error updating achievement progress: ${(error as Error).message}`);
  }
}



export const getFactAndCompletionStatus = async (userId: string, clientDate: string) => {
  try {
    console.log(`[getFactAndCompletionStatus] Fetching fact and completion status for userId: ${userId}, clientDate: ${clientDate}`);

    // Fetch fact of the day and completion status together
    const factWithCompletion = await db.factOfTheday.findFirst({
      where: {
        date: new Date(clientDate), // Find fact by client date
      },
      include: {
        completions: {
          where: { userId }, // Check if the user has completed it
        },
      },
    });

    if (!factWithCompletion) {
      return { fact: null, completed: false }; // No fact found
    }

    const isCompleted = factWithCompletion.completions.length > 0
      ? factWithCompletion.completions[0].completed
      : false;

    return {
      fact: {
        id: factWithCompletion.id,
        finalImage: factWithCompletion.finalImage,
        scratchImage: factWithCompletion.scratchImage,
        date: factWithCompletion.date,
        title: factWithCompletion.title
      },
      completed: isCompleted,
    };
  } catch (error) {
    console.error(`[getFactAndCompletionStatus] Error fetching fact and completion status for userId: ${userId}, clientDate: ${clientDate}:`, error);
    throw new Error(`Error fetching fact and completion status: ${(error as Error).message}`);
  }
};


function getStreakMessage(streakDay: number, username: string): string {
  const messages = [
    `${username}, every streak starts with one. How big can you make this one?`,
    `Day 2, ${username}! You're building momentum. Keep it up!`,
    `${username}, you're on fire! 3 days and counting.`,
    `4 days in, ${username}. You're proving your commitment!`,
    `High five, ${username}! You've reached day 5.`,
    `6 days strong, ${username}. You're almost there!`,
    `Congratulations, ${username}! You've completed a full week. What an achievement!`
  ];

  if (streakDay <= 7) {
    return messages[streakDay - 1];
  } else {
    return `Incredible, ${username}! You're on day ${streakDay} of your streak. Keep up the fantastic work!`;
  }
}







export const getTrendingFacts = async (clientDate: string) => {
  const today = new Date(clientDate);
  today.setUTCHours(0, 0, 0, 0);

  try {
    const trendingFacts = await db.factOfTheday.findMany({
      where: {
        date: {
          lt: today, // Only select facts with a date before the provided client date
        },
      },
      orderBy: {
        date: 'desc', // Order the facts by date in descending order
      },
      select: {
        id: true,
        finalImage: true,
        title: true,
        date: true,
      },
    });

    return trendingFacts;
  } catch (error) {
    throw new Error(`Error fetching trending facts: ${(error as Error).message}`);
  }
};



export const getCompletedFacts = async (userId:string) => {


  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Fetch the completed facts for the user
    const completedFacts = await db.factCompletion.findMany({
      where: {
        userId: userId,
        completed : true,
      },
      select: {
        factId: true,
      },
    });

    // Return the array of completed fact IDs
    return completedFacts.map((completion) => completion.factId);
  } catch (error) {
    console.error("Error fetching completed facts:", error);
    throw new Error("Failed to fetch completed facts");
  }
};