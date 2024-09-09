'use server';
import { currentUser } from "@/libs/auth"; // Import the current user authentication utility.
import { db } from "@/libs/db"; // Import the Prisma database instance.

/**
 * Updates the total watch time for a BeamsToday item and individual user analytics.
 * 
 * @param beamsTodayId - The ID of the BeamsToday item being watched.
 * @param watchTime - The amount of time (in seconds) spent watching/reading the content.
 * @param format - The format of the content being consumed ('video', 'audio', or 'text'). Defaults to 'video'.
 * @returns A message indicating the watch time has been updated.
 * @throws Throws an error if the user is not authenticated, the content does not exist, or if there is a database error.
 */
export const updateWatchTime = async (beamsTodayId: string, watchTime: number, format: 'video' | 'audio' | 'text' = 'video') => {
  try {
    const self = await currentUser(); // Retrieve the current user.
    const userId = self?.id; // Extract the user ID from the authenticated user.

    if (!userId) {
      throw new Error("User not authenticated"); // If no user is found, throw an error.
    }

    // Verify that the BeamsToday item exists.
    const beamsTodayExists = await db.beamsToday.findUnique({
      where: { id: beamsTodayId },
    });

    if (!beamsTodayExists) {
      throw new Error("BeamsToday not found"); // If the content doesn't exist, throw an error.
    }

    const roundedWatchTime = Math.round(watchTime); // Round the watch time to the nearest integer.

    // Prepare the update data for the BeamsToday item based on the format.
    const beamsTodayUpdateData: any = {
      totalWatchTime: {
        increment: roundedWatchTime, // Increment the total watch time for the content.
      },
    };

    if (format === 'video') {
      beamsTodayUpdateData.totalVideoWatchTime = { increment: roundedWatchTime };
    } else if (format === 'audio') {
      beamsTodayUpdateData.totalAudioListenTime = { increment: roundedWatchTime };
    } else if (format === 'text') {
      beamsTodayUpdateData.totalTextSpentTime = { increment: roundedWatchTime };
    }

    // Update the BeamsToday item with the new total watch time.
    await db.beamsToday.update({
      where: { id: beamsTodayId },
      data: beamsTodayUpdateData,
    });

    // Initialize individual watch time records for the user.
    let individualWatchTimesVideo: Record<string, number> = {};
    let individualWatchTimesAudio: Record<string, number> = {};
    let individualWatchTimesText: Record<string, number> = {};

    // Retrieve the user's analytics from the database.
    const userAnalytics = await db.beamsTodayUserAnalytics.findUnique({
      where: { userId },
    });

    if (userAnalytics) {
      // If user analytics exist, parse the watch time data for each format.
      if (userAnalytics.individualWatchTimesVideo) {
        individualWatchTimesVideo = typeof userAnalytics.individualWatchTimesVideo === 'string'
          ? JSON.parse(userAnalytics.individualWatchTimesVideo)
          : userAnalytics.individualWatchTimesVideo;
      }
      if (userAnalytics.individualWatchTimesAudio) {
        individualWatchTimesAudio = typeof userAnalytics.individualWatchTimesAudio === 'string'
          ? JSON.parse(userAnalytics.individualWatchTimesAudio)
          : userAnalytics.individualWatchTimesAudio;
      }
      if (userAnalytics.individualWatchTimesText) {
        individualWatchTimesText = typeof userAnalytics.individualWatchTimesText === 'string'
          ? JSON.parse(userAnalytics.individualWatchTimesText)
          : userAnalytics.individualWatchTimesText;
      }
    }

    // Update the individual watch times based on the format.
    if (format === 'video') {
      if (individualWatchTimesVideo[beamsTodayId]) {
        individualWatchTimesVideo[beamsTodayId] += roundedWatchTime;
      } else {
        individualWatchTimesVideo[beamsTodayId] = roundedWatchTime;
      }
    } else if (format === 'audio') {
      if (individualWatchTimesAudio[beamsTodayId]) {
        individualWatchTimesAudio[beamsTodayId] += roundedWatchTime;
      } else {
        individualWatchTimesAudio[beamsTodayId] = roundedWatchTime;
      }
    } else if (format === 'text') {
      if (individualWatchTimesText[beamsTodayId]) {
        individualWatchTimesText[beamsTodayId] += roundedWatchTime;
      } else {
        individualWatchTimesText[beamsTodayId] = roundedWatchTime;
      }
    }

    // Prepare the update data for the user analytics table.
    const userAnalyticsUpdateData: any = {
      totalWatchTimeBeamsToday: { increment: roundedWatchTime },
      totalVideoWatchTime: format === 'video' ? { increment: roundedWatchTime } : undefined,
      totalAudioListenTime: format === 'audio' ? { increment: roundedWatchTime } : undefined,
      totalTextSpentTime: format === 'text' ? { increment: roundedWatchTime } : undefined,
      individualWatchTimesVideo: format === 'video' ? individualWatchTimesVideo : undefined,
      individualWatchTimesAudio: format === 'audio' ? individualWatchTimesAudio : undefined,
      individualWatchTimesText: format === 'text' ? individualWatchTimesText : undefined,
    };

    // Upsert (create or update) the user's analytics with the new watch time data.
    await db.beamsTodayUserAnalytics.upsert({
      where: { userId },
      update: userAnalyticsUpdateData,
      create: {
        userId,
        totalWatchTimeBeamsToday: roundedWatchTime,
        totalVideoWatchTime: format === 'video' ? roundedWatchTime : 0,
        totalAudioListenTime: format === 'audio' ? roundedWatchTime : 0,
        totalTextSpentTime: format === 'text' ? roundedWatchTime : 0,
        individualWatchTimesVideo: format === 'video' ? individualWatchTimesVideo : {},
        individualWatchTimesAudio: format === 'audio' ? individualWatchTimesAudio : {},
        individualWatchTimesText: format === 'text' ? individualWatchTimesText : {},
      },
    });

    console.log("Watch time updated");
    return "Watch time updated"; // Return success message.
  } catch (error) {
    console.error(`Error updating watch time: ${(error as Error).message}`); // Log any errors.
    throw error; // Rethrow the error for handling in higher layers.
  }
};
