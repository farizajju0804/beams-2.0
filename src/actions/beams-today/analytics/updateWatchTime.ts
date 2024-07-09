'use server'
import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";

export const updateWatchTime = async (beamsTodayId: string, watchTime: number) => {
  try {
    const self = await currentUser();
    const userId = self?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const beamsTodayExists = await db.beamsToday.findUnique({
      where: { id: beamsTodayId },
    });

    if (!beamsTodayExists) {
      throw new Error("BeamsToday not found");
    }

    // Round off the watch time value
    const roundedWatchTime = Math.round(watchTime);

    // Update the total watch time for the beamsToday
    await db.beamsToday.update({
      where: { id: beamsTodayId },
      data: { totalWatchTime: { increment: roundedWatchTime } },
    });

    // Get the user's analytics
    const userAnalytics = await db.userAnalytics.findUnique({
      where: { userId },
    });

    // Initialize individual watch times if they don't exist
    let individualWatchTimesBeamsToday: Record<string, number> = {};
    if (userAnalytics?.individualWatchTimesBeamsToday) {
      individualWatchTimesBeamsToday = typeof userAnalytics.individualWatchTimesBeamsToday === 'string'
        ? JSON.parse(userAnalytics.individualWatchTimesBeamsToday)
        : userAnalytics.individualWatchTimesBeamsToday;
    }

    // Update the individual watch time for the beamsToday
    if (individualWatchTimesBeamsToday[beamsTodayId]) {
      individualWatchTimesBeamsToday[beamsTodayId] += roundedWatchTime;
    } else {
      individualWatchTimesBeamsToday[beamsTodayId] = roundedWatchTime;
    }

    // Upsert the user's total and individual watch times
    await db.userAnalytics.upsert({
      where: { userId },
      update: {
        totalWatchTimeBeamsToday: { increment: roundedWatchTime },
        individualWatchTimesBeamsToday: individualWatchTimesBeamsToday,
      },
      create: {
        userId,
        totalWatchTimeBeamsToday: roundedWatchTime,
        individualWatchTimesBeamsToday: individualWatchTimesBeamsToday,
      },
    });

    return "Watch time updated";
  } catch (error) {
    console.error(`Error updating watch time: ${(error as Error).message}`);
    throw error;
  }
};
