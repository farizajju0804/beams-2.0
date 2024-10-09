"use server";

import { db } from "@/libs/db";
import { UserType } from "@prisma/client";

import { getTop10EntriesForMostRecentWeek, getTop3EntriesForMostRecentWeek } from "./getPreviousLeaderboard";
import { generateNotification } from "../notifications/notifications";

// Update achievements only if there are at least 3 leaderboard entries for the previous week
export const updateAchievementsAfterLeaderboard = async (userType: UserType) => {
  try {
    // Get the top 10 entries from the last week's leaderboard
    const lastWeekData = await getTop10EntriesForMostRecentWeek(userType,'2024-10-09T18:00:00.413Z');

    // Only proceed if there are at least 3 entries
    if (lastWeekData.entries.length < 3) {
      console.log('Not enough entries for last week. Achievements will not be updated.');
      return; // Exit the function if there are fewer than 3 entries
    }

    // Loop through the top 10 leaderboard entries
    for (const userEntry of lastWeekData.entries) {
      const { userId, rank } = userEntry;

      // Check the rank and assign the corresponding achievement
      if (rank === 1) {
        // Top 1: Supreme Champion Achievement
        await updateUserAchievement(userId, "Supreme Champion", `/achievements/#supreme-champion`);
      } else if (rank >= 2 && rank <= 10) {
        // Top 2-10: Elite Climber Achievement
        await updateUserAchievement(userId, "Elite Climber", `/achievements/#elite-climber`);
      }
    }
  } catch (error) {
    console.error("Error updating achievements after leaderboard:", error);
    throw new Error(`Error updating achievements after leaderboard: ${(error as Error).message}`);
  }
};

// Update or create an achievement for a user
const updateUserAchievement = async (userId: string, achievementName: string, notificationUrl: string) => {
  const achievement = await db.achievement.findUnique({
    where: { name: achievementName },
  });

  if (!achievement) {
    throw new Error(`Achievement '${achievementName}' not found.`);
  }

  let userAchievement = await db.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
  });

  if (userAchievement?.completionStatus) {
    // If already completed, do nothing
    console.log(`Achievement '${achievementName}' already completed for user ${userId}`);
    return;
  }

  if (!userAchievement) {
    // Create new achievement progress
    userAchievement = await db.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
        progress: 1,
        completionStatus: false,
        updatedAt: new Date(),
      },
    });
  } else {
    // Increment progress
    const newProgress = userAchievement.progress + 1;
    const isNowCompleted = newProgress >= achievement.totalCount;

    await db.userAchievement.update({
      where: { id: userAchievement.id },
      data: {
        progress: newProgress,
        completionStatus: isNowCompleted,
        updatedAt: new Date(),
      },
    });

    // If completed, generate a notification
    if (isNowCompleted) {
      await generateNotification(
        userId,
        "ACHIEVEMENT",
        `Congratulations! You've unlocked '${achievementName}' badge!`,
        notificationUrl
      );
    }
  }
};
