'use server'
import { db } from "@/libs/db";

export const markTopicAsCompleted = async (userId: string, beamsTodayId: string) => {
  try {
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true }
    });

    if (!watchedContent) {
      // If the user entry doesn't exist, create it with the new topic ID
      await db.beamsTodayWatchedContent.create({
        data: {
          userId,
          completedBeamsToday: [beamsTodayId],
          updatedAt: new Date()
        }
      });
    } else if (!watchedContent.completedBeamsToday.includes(beamsTodayId)) {
      // If the topic ID is not already in the array, add it
      await db.beamsTodayWatchedContent.update({
        where: { userId },
        data: {
          completedBeamsToday: {
            push: beamsTodayId
          },
          updatedAt: new Date()
        }
      });
    }
  } catch (error) {
    throw new Error(`Error marking topic as completed: ${(error as Error).message}`);
  }
};

export const getcompletedBeamsToday = async (userId: string) => {
  try {
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true }
    });
    return watchedContent?.completedBeamsToday || [];
  } catch (error) {
    throw new Error(`Error fetching completed topics: ${(error as Error).message}`);
  }
};
