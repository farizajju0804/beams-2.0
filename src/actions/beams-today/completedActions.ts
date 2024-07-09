'use server'
import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";

export const markTopicAsCompleted = async (beamsTodayId: string) => {
  const user:any = await currentUser(); 
  const userId = user.id;
  try {
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true }
    });

    if (!watchedContent) {
      // If the user entry doesn't exist, create it with the new topic ID and increment view count
      await db.beamsTodayWatchedContent.create({
        data: {
          userId,
          completedBeamsToday: [beamsTodayId],
          updatedAt: new Date()
        }
      });

      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });
    } else if (!watchedContent.completedBeamsToday.includes(beamsTodayId)) {
      // If the topic ID is not already in the array, add it and increment view count
      await db.beamsTodayWatchedContent.update({
        where: { userId },
        data: {
          completedBeamsToday: {
            push: beamsTodayId
          },
          updatedAt: new Date()
        }
      });

      await db.beamsToday.update({
        where: { id: beamsTodayId },
        data: {
          viewCount: {
            increment: 1
          }
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
