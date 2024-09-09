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

    if (!watchedContent) {
      // If no watched content entry exists for the user, create a new entry.
      const newWatchedContent = {
        userId,
        completedBeamsToday: [beamsTodayId], // Add the topic ID to the completed topics.
        completedFormats: { [beamsTodayId]: [format] }, // Mark the format as completed.
        updatedAt: new Date()
      };

      await db.beamsTodayWatchedContent.create({
        data: newWatchedContent
      });

      // Increment the view count for the content, including format-specific counts.
      const updateData = {
        viewCount: {
          increment: 1
        },
        videoViewCount: 0,
        audioViewCount: 0,
        textViewCount: 0,
        ...(format === 'video' && { videoViewCount: { increment: 1 } }),
        ...(format === 'audio' && { audioViewCount: { increment: 1 } }),
        ...(format === 'text' && { textViewCount: { increment: 1 } })
      };

      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: updateData
      });

    } else {
      // If the user has watched content, check if the topic and format are already completed.
      const { completedBeamsToday } = watchedContent;
      const hasCompleted = completedBeamsToday.includes(beamsTodayId);
      const hasCompletedFormat = completedFormatsForBeamsToday.includes(format);

      if (!hasCompleted) {
        // If the topic has not been completed yet, add it to the user's completed topics.
        await db.beamsTodayWatchedContent.update({
          where: { userId },
          data: {
            completedBeamsToday: {
              push: beamsTodayId
            },
            completedFormats: {
              ...completedFormats,
              [beamsTodayId]: [format] // Mark the format as completed.
            },
            updatedAt: new Date()
          }
        });

        // Increment the view counts for the content and the format.
        const updateData = {
          viewCount: {
            increment: 1
          },
          ...(format === 'video' && { videoViewCount: { increment: 1 } }),
          ...(format === 'audio' && { audioViewCount: { increment: 1 } }),
          ...(format === 'text' && { textViewCount: { increment: 1 } })
        };

        await db.beamsToday.update({
          where: { id: beamsTodayId },
          data: updateData
        });
      } else if (!hasCompletedFormat) {
        // If the topic has been completed but not in the current format, update it.
        await db.beamsTodayWatchedContent.update({
          where: { userId },
          data: {
            completedFormats: {
              ...completedFormats,
              [beamsTodayId]: [...completedFormatsForBeamsToday, format] // Add the new format to the completed formats.
            },
            updatedAt: new Date()
          }
        });

        // Increment the view count for the specific format.
        const updateData = {
          ...(format === 'video' && { videoViewCount: { increment: 1 } }),
          ...(format === 'audio' && { audioViewCount: { increment: 1 } }),
          ...(format === 'text' && { textViewCount: { increment: 1 } })
        };

        await db.beamsToday.update({
          where: { id: beamsTodayId },
          data: updateData
        });
      }
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
