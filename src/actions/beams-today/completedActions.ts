'use server'; // Specifies that this code runs on the server side.

import { currentUser } from "@/libs/auth"; // Function to get the currently authenticated user.
import { db } from "@/libs/db"; // Import the Prisma database instance.
import { getBeamsTodayById } from "./getBeamsTodayById";

import { updateUserPointsAndLeaderboard } from "../points/updateUserPointsAndLeaderboard";
import { Achievement } from "@prisma/client";
import { BEAMS_TODAY_COMPLETION_POINTS } from "@/constants/pointsConstants";
import { beamsTodayBadge10, beamsTodayBadge50 } from "@/constants/victoryConstants";

/**
 * Marks a specific topic as completed by a user in a given format (video, audio, or text).
 * This function also increments the view count for the content.
 * 
 * @param beamsTodayId - The ID of the topic being marked as completed.
 * @param format - The format of the completed content ('video', 'audio', or 'text').
 * @throws Throws an error if the topic could not be marked as completed.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *                            - success: boolean indicating if it was the first completion,
 *                            - leveledUp: boolean indicating if the user leveled up,
 *                            - beams: user's current beam points,
 *                            - newLevel: the user's new level,
 *                            - pointsAdded: points added for completion,
 *                            - achievementUpdate: updates related to achievements.
 */
export const markTopicAsCompleted = async (beamsTodayId: string, format: 'video' | 'audio' | 'text') => {
  console.log(`[markTopicAsCompleted] Starting for beamsTodayId: ${beamsTodayId}, format: ${format}`);

  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    console.error('[markTopicAsCompleted] User not authenticated');
    throw new Error("User not authenticated.");
  }

  console.log(`[markTopicAsCompleted] User ID: ${userId} is attempting to mark topic as completed...`);

  try {
    console.log(`[markTopicAsCompleted] Fetching watched content for user ${userId}`);
    let watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true, completedFormats: true },
    });

    if (!watchedContent) {
      console.log(`[markTopicAsCompleted] No watched content found for user ${userId}. Creating new entry.`);
      watchedContent = await db.beamsTodayWatchedContent.create({
        data: {
          userId,
          completedBeamsToday: [],
          completedFormats: {},
        },
      });
    }

    let completedFormats: any = watchedContent.completedFormats || {};
    let completedBeamsToday = watchedContent.completedBeamsToday || [];

    console.log(`[markTopicAsCompleted] Current completedFormats:`, completedFormats);
    console.log(`[markTopicAsCompleted] Current completedBeamsToday:`, completedBeamsToday);

    if (!completedFormats[beamsTodayId]) {
      console.log(`[markTopicAsCompleted] Initializing completedFormats for beamsTodayId: ${beamsTodayId}`);
      completedFormats[beamsTodayId] = [];
    }

    if (!completedFormats[beamsTodayId].includes(format)) {
      console.log(`[markTopicAsCompleted] Marking format ${format} as completed for beamsTodayId: ${beamsTodayId}`);
      completedFormats[beamsTodayId].push(format);
    }

    const isFirstCompletion = !completedBeamsToday.includes(beamsTodayId);
    console.log(`[markTopicAsCompleted] Is this the first completion? ${isFirstCompletion}`);

    let pointsAdded = 0;
    let userBeamPoints = null;
    let leveledUp = false;
    let newLevel = null;
    let achievementUpdate = null;

    if (isFirstCompletion) {
      console.log(`[markTopicAsCompleted] Processing first-time completion for beamsTodayId: ${beamsTodayId}`);
      
      completedBeamsToday.push(beamsTodayId);
      
      console.log(`[markTopicAsCompleted] Updating completion count for beamsTodayId: ${beamsTodayId}`);
      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: { completionCount: { increment: 1 } },
      });
      
      pointsAdded = BEAMS_TODAY_COMPLETION_POINTS;
      console.log(`[markTopicAsCompleted] Points added: ${pointsAdded}`);

      console.log(`[markTopicAsCompleted] Updating user points`);

      const beamsToday = await getBeamsTodayById(beamsTodayId);

      const updateResult = await updateUserPointsAndLeaderboard(
        userId, 
        pointsAdded, 
        'BEAMS_TODAY', 
        `Completed beams today, "${beamsToday.title}"`, 
        user.userType
      );
      const { userBeamPoints: beams, leveledUp: leveledUpFlag, newLevel: updatedLevel, levelCaption: caption } = updateResult;
      leveledUp = leveledUpFlag;
      newLevel = updatedLevel;
      userBeamPoints = beams;

      achievementUpdate = await updateAchievementProgress(userId, [beamsTodayBadge10, beamsTodayBadge50]);
      console.log(`Progress Updated:`, achievementUpdate);
    }

    console.log(`[markTopicAsCompleted] Updating watched content`);
    await db.beamsTodayWatchedContent.update({
      where: { userId },
      data: { completedFormats, completedBeamsToday, updatedAt: new Date() },
    });

    console.log(`[markTopicAsCompleted] Operation completed successfully`);

    return {
      success: isFirstCompletion,
      leveledUp,
      beams: userBeamPoints?.beams,
      newLevel,
      pointsAdded,
      achievementUpdate
    };
  } catch (error) {
    console.error("[markTopicAsCompleted] Error marking topic as completed:", error);
    throw new Error("Error marking topic as completed.");
  }
};

/**
 * Updates the achievement progress for a user based on completed achievements.
 *
 * @param userId - The ID of the user whose achievements are being updated.
 * @param achievements - An array of achievement names to update progress for.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *                            - achievementUpdates: an object mapping achievement names to progress updates.
 * @throws Throws an error if updating achievement progress fails.
 */
async function updateAchievementProgress(
  userId: string,
  achievements: string[]
): Promise<{ achievementUpdates: { [key: string]: { progress: number; isFirstTimeCompletion: boolean } } }> {
  try {
    console.log(`[updateAchievementProgress] Processing achievements for userId: ${userId}, achievements: ${achievements.join(", ")}`);

    const achievementUpdates: { [key: string]: { progress: number; isFirstTimeCompletion: boolean, achievement: Achievement } } = {};

    for (const achievementName of achievements) {
      // Find the achievement by name
      const achievement = await db.achievement.findUnique({
        where: { name: achievementName },
      });

      if (!achievement) {
        console.error(`[updateAchievementProgress] Achievement '${achievementName}' not found`);
        throw new Error(`Achievement '${achievementName}' not found`);
      }

      // Check if the user already has progress for this achievement
      let userAchievement = await db.userAchievement.findUnique({
        where: { userId_achievementId: { userId, achievementId: achievement.id } },
        include: { achievement: true },
      });

      // If the achievement is already completed, skip it
      if (userAchievement && userAchievement.completionStatus) {
        console.log(`[updateAchievementProgress] Achievement already completed for userId: ${userId}, achievement: ${achievementName}`);
        achievementUpdates[achievementName] = { progress: userAchievement.progress, isFirstTimeCompletion: false, achievement: userAchievement.achievement };
        continue;
      }

      let newProgress = 1;
      let isNowCompleted = false;

      // If no progress exists, create a new entry
      if (!userAchievement) {
        console.log(`[updateAchievementProgress] No existing progress, creating new entry for userId: ${userId}, achievement: ${achievementName}`);

        userAchievement = await db.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            progress: newProgress,
            completionStatus: false,
            updatedAt: new Date(),
          },
          include: { achievement: true }
        });
      } else {
        // Increment progress
        newProgress = userAchievement.progress + 1;
        isNowCompleted = newProgress >= achievement.totalCount;

        // Update progress and completion status
        userAchievement = await db.userAchievement.update({
          where: { id: userAchievement.id },
          data: {
            progress: newProgress,
            completionStatus: isNowCompleted,
            updatedAt: new Date(),
          },
          include: { achievement: true },
        });
      }

      achievementUpdates[achievementName] = { progress: newProgress, isFirstTimeCompletion: isNowCompleted, achievement: userAchievement.achievement };
    }

    return {
      achievementUpdates
    };
  } catch (error) {
    console.error(`[updateAchievementProgress] Error updating achievement progress:`, error);
    throw new Error(`Error updating achievement progress: ${(error as Error).message}`);
  }
}



/**
 * Increment the view count for a topic and format when a user opens a tab.
 * This ensures the overall view count for a topic only increments once per user.
 * @param beamsTodayId - The ID of the topic being viewed.
 * @param format - The format being viewed ('video', 'audio', 'text').
 */
export const incrementViewCount = async (beamsTodayId: string, format: 'video' | 'audio' | 'text') => {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) throw new Error("User not authenticated.");

  try {
    // Fetch the user's watched content and viewed topics
    let watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { viewedBeamsToday: true, viewedFormats: true }
    });

    // Initialize the viewedBeamsToday array and viewedFormats JSON if no record exists
    let viewedBeamsToday: string[] = [];
    let viewedFormats: any = {};

    // If the user's watched content doesn't exist, create a new entry
    if (!watchedContent) {
      // Create a new entry for the user with empty viewedBeamsToday and viewedFormats
      await db.beamsTodayWatchedContent.create({
        data: {
          userId,
          viewedBeamsToday: [beamsTodayId],
          viewedFormats: { [beamsTodayId]: [format] }, // Track the format viewed for the first time
          updatedAt: new Date()
        }
      });

      // Increment the overall view count
      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: { viewCount: { increment: 1 } }
      });

      // Increment the format-specific view count
      const updateData: Record<string, any> = {};
      if (format === 'video') updateData.videoViewCount = { increment: 1 };
      if (format === 'audio') updateData.audioViewCount = { increment: 1 };
      if (format === 'text') updateData.textViewCount = { increment: 1 };

      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: updateData
      });

      return; // Exit after creating the initial entry and updating the counts
    }

    // If watched content exists, retrieve the data
    viewedBeamsToday = watchedContent.viewedBeamsToday || [];
    viewedFormats = watchedContent.viewedFormats || {};

    // Check if the topic has already been viewed (to avoid duplicate view counts)
    let hasViewed = viewedBeamsToday.includes(beamsTodayId);

    // If the topic has not been viewed, increment the overall view count
    if (!hasViewed) {
      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: { viewCount: { increment: 1 } }
      });

      // Add the topic to the viewedBeamsToday array
      viewedBeamsToday.push(beamsTodayId);
    }

    // Check if the specific format has been viewed for this topic
    let viewedFormatsForBeamsToday = viewedFormats[beamsTodayId] || [];

    if (!viewedFormatsForBeamsToday.includes(format)) {
      // Increment the view count for the specific format
      const updateData: Record<string, any> = {};
      if (format === 'video') updateData.videoViewCount = { increment: 1 };
      if (format === 'audio') updateData.audioViewCount = { increment: 1 };
      if (format === 'text') updateData.textViewCount = { increment: 1 };

      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: updateData
      });

      // Add the format to the viewedFormats for this topic
      viewedFormatsForBeamsToday.push(format);
    }

    // Update the user's watched content with the new viewed data
    await db.beamsTodayWatchedContent.update({
      where: { userId },
      data: {
        viewedBeamsToday,
        viewedFormats: {
          ...viewedFormats,
          [beamsTodayId]: viewedFormatsForBeamsToday // Update the formats for the topic
        },
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error("Error incrementing view count:", error);
    throw new Error(`Error incrementing view count: ${(error as Error).message}`);
  }
};



/**
 * Fetches the list of completed topics for a specific user.
 * 
 * @param userId - The ID of the user whose completed topics are being fetched.
 * @returns An array of topic IDs that the user has completed.
 * @throws Throws an error if the completed topics cannot be fetched.
 */
export const getcompletedBeamsToday = async (userId: string) => {
  try {
    // Fetch the user's completed topics from the watched content table.
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true }
    });
    return watchedContent?.completedBeamsToday || []; // Return the completed topics or an empty array if none exist.
  } catch (error) {
    console.error(`Error fetching completed topics:`, error);
    throw new Error(`Error fetching completed topics: ${(error as Error).message}`);
  }
};


