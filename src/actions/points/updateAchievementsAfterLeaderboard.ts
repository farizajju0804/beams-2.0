"use server"; // Indicates that this module should be treated as a server-side module

import { db } from "@/libs/db"; // Importing the database instance
import { UserType } from "@prisma/client"; // Importing UserType from Prisma client

import { getTop10EntriesForMostRecentWeek } from "./getPreviousLeaderboard"; // Function to fetch top 10 entries for the most recent week
import { generateNotification } from "../notifications/notifications"; // Function to generate notifications
import { leaderboardBadgeTop1, leaderboardBadgeTop10 } from "@/constants/victoryConstants"; // Constants for achievement badges

/**
 * Updates user achievements based on leaderboard entries from the previous week.
 * Achievements are updated only if there are at least 3 entries in the leaderboard.
 *
 * @param userType - The type of user (e.g., admin, regular user) to filter leaderboard entries.
 * 
 * @throws Throws an error if an issue occurs during the leaderboard data retrieval or achievement update.
 */
export const updateAchievementsAfterLeaderboard = async (userType: UserType) => {
  try {
    // Get the top 10 entries from the last week's leaderboard
    const lastWeekData = await getTop10EntriesForMostRecentWeek(userType);

    // Only proceed if there are at least 3 entries
    if (lastWeekData.entries.length < 3) {
      console.log('Not enough entries for last week. Achievements will not be updated.');
      return; // Exit the function if there are fewer than 3 entries
    }

    // Loop through the top 10 leaderboard entries
    for (const userEntry of lastWeekData.entries) {
      const { userId, rank } = userEntry; // Destructure userId and rank from the entry

      // Check the rank and assign the corresponding achievement
      if (rank === 1) {
        // Top 1: Supreme Champion Achievement
        await updateUserAchievement(userId, leaderboardBadgeTop1);
      } else if (rank >= 2 && rank <= 10) {
        // Top 2-10: Elite Climber Achievement
        await updateUserAchievement(userId, leaderboardBadgeTop10);
      }
    }
  } catch (error) {
    console.error("Error updating achievements after leaderboard:", error);
    throw new Error(`Error updating achievements after leaderboard: ${(error as Error).message}`);
  }
};

/**
 * Updates or creates an achievement for a user based on the provided achievement name.
 * 
 * @param userId - The unique identifier of the user.
 * @param achievementName - The name of the achievement to update or create.
 * 
 * @throws Throws an error if the achievement is not found or if an error occurs during the update.
 */
const updateUserAchievement = async (userId: string, achievementName: string) => {
  const achievement = await db.achievement.findUnique({
    where: { name: achievementName }, // Find the achievement by its name
  });

  if (!achievement) {
    throw new Error(`Achievement '${achievementName}' not found.`); // Throw an error if the achievement does not exist
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
    // Create new achievement progress if it doesn't exist
    userAchievement = await db.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
        progress: 1, // Start progress at 1
        completionStatus: false, // Initially not completed
        updatedAt: new Date(),
      },
    });
  } else {
    // Increment progress for existing achievement
    const newProgress = userAchievement.progress + 1;
    const isNowCompleted = newProgress >= achievement.totalCount; // Check if the achievement is now complete

    await db.userAchievement.update({
      where: { id: userAchievement.id },
      data: {
        progress: newProgress,
        completionStatus: isNowCompleted, // Update completion status
        updatedAt: new Date(),
      },
    });

    // If completed, generate a notification for the user
    if (isNowCompleted) {
      await generateNotification(
        userId,
        "ACHIEVEMENT",
        `Congratulations! You've unlocked '${achievementName}' badge!`, // Notification message
        `/achievements/#${achievement.id}` // Redirect link for achievement details
      );
    }
  }
};
