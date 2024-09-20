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
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) throw new Error("User not authenticated.");

  console.log(`User ID: ${userId} is attempting to mark topic as completed...`);

  try {
    // Fetch the user's watched content, including completed topics and formats.
    let watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true, completedFormats: true },
    });

    // If watchedContent doesn't exist, create it
    if (!watchedContent) {
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

    // Ensure the format array for this beamsTodayId exists.
    if (!completedFormats[beamsTodayId]) {
      completedFormats[beamsTodayId] = [];
    }

    // If the format is not yet completed, mark it as completed.
    if (!completedFormats[beamsTodayId].includes(format)) {
      completedFormats[beamsTodayId].push(format);
    }

    // Check if this is the first time completing this BeamsToday
    const isFirstCompletion = !completedBeamsToday.includes(beamsTodayId);
    let pointsAdded = 0;

    if (isFirstCompletion) {
      completedBeamsToday.push(beamsTodayId);
      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: { completionCount: { increment: 1 } },
      });
      pointsAdded = 100; // Only add points on first completion
    }

    // Update user points and check for level up
    const { userBeamPoints, leveledUp, newLevel } = await updateUserPoints(userId, pointsAdded);

    // Record points history
    const beamsToday = await getBeamsTodayById(beamsTodayId);
    await recordPointsHistory(userId, pointsAdded, 'BEAMS_TODAY', `Completed beams today of topic "${beamsToday.title}"`);

    // Update leaderboard entry
    await updateLeaderboardEntry(userId, pointsAdded, user.userType);

    // Update watched content
    await db.beamsTodayWatchedContent.update({
      where: { userId },
      data: { completedFormats, completedBeamsToday, updatedAt: new Date() },
    });

    console.log('User Beam Points:', userBeamPoints);
    return {
      success: isFirstCompletion,
      leveledUp,
      currentLevel: userBeamPoints?.level,
      currentPoints: userBeamPoints?.beams,
      newLevel,
      pointsAdded // Show how many points were added
    };
  } catch (error) {
    console.error("Error marking topic as completed:", error);
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
