'use server'; // Specifies that this code runs on the server side.

import { currentUser } from "@/libs/auth"; // Function to get the currently authenticated user.
import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Marks a specific topic as completed by a user in a given format (video, audio, or text).
 * This function also increments the view count for the content.
 * 
 * @param beamsTodayId - The ID of the topic being marked as completed.
 * @param format - The format of the completed content ('video', 'audio', or 'text'). Default is 'video'.
 * @throws Throws an error if the topic could not be marked as completed.
 */
export const markTopicAsCompleted = async (beamsTodayId: string, format: 'video' | 'audio' | 'text' = 'video') => {
  const user: any = await currentUser(); // Retrieve the currently logged-in user.
  const userId = user.id; // Extract the user ID from the user object.

  try {
    // Fetch the user's watched content, including completed topics and formats.
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true, completedFormats: true }
    });

    // Initialize the completedFormats object if no data exists.
    let completedFormats: any = {};

    if (watchedContent) {
      completedFormats = watchedContent.completedFormats; // If data exists, populate completedFormats.
    }

    // Get the formats completed for the current topic.
    const completedFormatsForBeamsToday = completedFormats[beamsTodayId] || [];

    let shouldIncrementViewCount = false;
    let shouldIncrementFormatViewCount = false;

    // Check if the topic (beamsTodayId) has been completed by the user
    if (!watchedContent || !watchedContent.completedBeamsToday.includes(beamsTodayId)) {
      // If not completed, mark the topic as completed and increment the overall view count
      shouldIncrementViewCount = true;

      // Create a new entry for the user if watched content doesn't exist
      if (!watchedContent) {
        await db.beamsTodayWatchedContent.create({
          data: {
            userId,
            completedBeamsToday: [beamsTodayId],
            completedFormats: { [beamsTodayId]: [format] },
            updatedAt: new Date()
          }
        });
      } else {
        // Update existing user data to mark the topic as completed
        await db.beamsTodayWatchedContent.update({
          where: { userId },
          data: {
            completedBeamsToday: {
              push: beamsTodayId
            },
            completedFormats: {
              ...completedFormats,
              [beamsTodayId]: [format]
            },
            updatedAt: new Date()
          }
        });
      }
    }

    // Check if the specific format has not been completed for this topic
    if (!completedFormatsForBeamsToday.includes(format)) {
      shouldIncrementFormatViewCount = true;

      // Update the watched content with the newly completed format
      await db.beamsTodayWatchedContent.update({
        where: { userId },
        data: {
          completedFormats: {
            ...completedFormats,
            [beamsTodayId]: [...completedFormatsForBeamsToday, format]
          },
          updatedAt: new Date()
        }
      });
    }

    // Build the data for updating view counts
    const updateData: any = {};
    
    // Increment the general viewCount if the topic has not been marked as completed yet
    if (shouldIncrementViewCount) {
      updateData.viewCount = { increment: 1 };
    }

    // Increment the format-specific view count if the format was not completed
    if (shouldIncrementFormatViewCount) {
      if (format === 'video') {
        updateData.videoViewCount = { increment: 1 };
      } else if (format === 'audio') {
        updateData.audioViewCount = { increment: 1 };
      } else if (format === 'text') {
        updateData.textViewCount = { increment: 1 };
      }
    }

    // Update the view count in the beamsToday table if there are changes
    if (Object.keys(updateData).length > 0) {
      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: updateData
      });
    }
  } catch (error) {
    console.error(`Error marking topic as completed:`, error);
    throw new Error(`Error marking topic as completed: ${(error as Error).message}`);
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
