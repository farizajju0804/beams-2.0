'use server'; // Specifies that this code runs on the server side.

import { currentUser } from "@/libs/auth"; // Function to get the currently authenticated user.
import { db } from "@/libs/db"; // Import the Prisma database instance.
import { getBeamsTodayById } from "./getBeamsTodayById";
import { updateLeaderboardEntry } from "../points/updateLeaderboardEntry";
import { recordPointsHistory } from "../points/recordPointsHistory";
import { updateUserPoints } from "../points/updateUserPoints";

/**
 * Marks a specific topic as completed by a user in a given format (video, audio, or text).
 * This function also increments the view count for the content.
 * 
 * @param beamsTodayId - The ID of the topic being marked as completed.
 * @param format - The format of the completed content ('video', 'audio', or 'text'). Default is 'video'.
 * @throws Throws an error if the topic could not be marked as completed.
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

    if (isFirstCompletion) {
      console.log(`[markTopicAsCompleted] Processing first-time completion for beamsTodayId: ${beamsTodayId}`);
      
      completedBeamsToday.push(beamsTodayId);
      
      console.log(`[markTopicAsCompleted] Updating completion count for beamsTodayId: ${beamsTodayId}`);
      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: { completionCount: { increment: 1 } },
      });
      
      pointsAdded = 100;
      console.log(`[markTopicAsCompleted] Points added: ${pointsAdded}`);

      console.log(`[markTopicAsCompleted] Updating user points`);
      ({ userBeamPoints, leveledUp, newLevel } = await updateUserPoints(userId, pointsAdded));
      console.log(`[markTopicAsCompleted] User points updated. New points:`, userBeamPoints);
      console.log(`[markTopicAsCompleted] Level up?`, leveledUp);
      console.log(`[markTopicAsCompleted] New level:`, newLevel);

      console.log(`[markTopicAsCompleted] Recording points history`);
      const beamsToday = await getBeamsTodayById(beamsTodayId);
      await recordPointsHistory(userId, pointsAdded, 'BEAMS_TODAY', `Completed beams today, "${beamsToday.title}"`);

      console.log(`[markTopicAsCompleted] Updating leaderboard entry`);
      await updateLeaderboardEntry(userId, pointsAdded, user.userType);
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
      currentLevel: userBeamPoints?.level,
      currentPoints: userBeamPoints?.beams,
      newLevel,
      pointsAdded
    };
  } catch (error) {
    console.error("[markTopicAsCompleted] Error marking topic as completed:", error);
    throw new Error("Error marking topic as completed.");
  }
};
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
