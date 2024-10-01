"use server"; // Indicates that this code runs on the server side.

import { db } from "@/libs/db"; // Import the Prisma database instance.




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
    await updateAchievementProgress(userId, 'Week Warrior', clientDate);

    console.log(`[markFactAsCompleted] Achievement progress updated for userId: ${userId} for achievement 'Week Warrior'`);

    return { message: "Fact marked as completed." };
  } catch (error) {
    console.error(`[markFactAsCompleted] Error marking fact as completed for userId: ${userId}, factId: ${factId}:`, error);
    throw new Error(`Error marking fact as completed: ${(error as Error).message}`);
  }
};


async function updateAchievementProgress(userId: string, achievementName: string, clientDate: string) {
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

    const today = new Date('2024-10-05T00:00:00.000+00:00');
    // const today = new Date(clientDate);
    today.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC for comparing days

    console.log(`[updateAchievementProgress] Today's date set to ${today.toISOString()}`);

    // Check if user already has progress for this achievement
    let userAchievement = await db.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });

    if (!userAchievement) {
      console.log(`[updateAchievementProgress] No existing achievement progress found. Creating new entry for userId: ${userId}, achievementId: ${achievement.id}`);

      // Create new achievement progress (first time for this user)
      await db.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          progress: 1,
          updatedAt: today,
        },
      });

      console.log(`[updateAchievementProgress] New achievement progress created for userId: ${userId}, achievementId: ${achievement.id}`);
    } else {
      console.log(`[updateAchievementProgress] Existing achievement progress found for userId: ${userId}, achievementId: ${achievement.id}`);

      const lastUpdated = new Date(userAchievement.updatedAt);
      lastUpdated.setUTCHours(0, 0, 0, 0); // Normalize to midnight for accurate day comparison

      const dayDifference = Math.floor((today.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDifference === 1) {
        console.log(`[updateAchievementProgress] Last updated yesterday (${lastUpdated.toISOString()}). Incrementing progress for userId: ${userId}`);

        // Increment progress for daily streak
        const newProgress = userAchievement.progress + 1;
        await db.userAchievement.update({
          where: { id: userAchievement.id },
          data: {
            progress: newProgress,
            completionStatus: newProgress >= achievement.totalCount,
            updatedAt: today,
          },
        });

        console.log(`[updateAchievementProgress] Achievement progress incremented for userId: ${userId}, new progress: ${newProgress}`);
      } else if (dayDifference > 1) {
        console.log(`[updateAchievementProgress] Last updated more than 1 day ago (${lastUpdated.toISOString()}). Resetting progress for userId: ${userId}`);

        // Reset progress if more than 1 day has passed
        await db.userAchievement.update({
          where: { id: userAchievement.id },
          data: {
            progress: 1,
            completionStatus: false, // Reset completion status if the achievement requires multiple completions
            updatedAt: today,
          },
        });

        console.log(`[updateAchievementProgress] Achievement progress reset for userId: ${userId}`);
      } else {
        console.log(`[updateAchievementProgress] Progress is already updated for today (${today.toISOString()}) for userId: ${userId}`);
      }
    }
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
      },
      completed: isCompleted,
    };
  } catch (error) {
    console.error(`[getFactAndCompletionStatus] Error fetching fact and completion status for userId: ${userId}, clientDate: ${clientDate}:`, error);
    throw new Error(`Error fetching fact and completion status: ${(error as Error).message}`);
  }
};

