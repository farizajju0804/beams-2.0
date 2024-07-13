'use server'
import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";

export const markTopicAsCompleted = async (beamsTodayId: string, format: 'video' | 'audio' | 'text' = 'video') => {
  const user: any = await currentUser();
  const userId = user.id;

  try {
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true, completedFormats: true }
    });

    let completedFormats: any = {};

    if (watchedContent) {
      completedFormats = watchedContent.completedFormats;
    }

    const completedFormatsForBeamsToday = completedFormats[beamsTodayId] || [];



    if (!watchedContent) {
      // If the user entry doesn't exist, create it with the new topic ID and increment view count
      const newWatchedContent = {
        userId,
        completedBeamsToday: [beamsTodayId],
        completedFormats: { [beamsTodayId]: [format] },
        updatedAt: new Date()
      };

      await db.beamsTodayWatchedContent.create({
        data: newWatchedContent
      });

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
      const { completedBeamsToday } = watchedContent;
      const hasCompleted = completedBeamsToday.includes(beamsTodayId);
      const hasCompletedFormat = completedFormatsForBeamsToday.includes(format);

 

      if (!hasCompleted) {
        // If the topic ID is not already in the array, add it
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
        // If the format is not already in the array, add it
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

export const getcompletedBeamsToday = async (userId: string) => {
  try {
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true }
    });
    return watchedContent?.completedBeamsToday || [];
  } catch (error) {
    console.error(`Error fetching completed topics:`, error);
    throw new Error(`Error fetching completed topics: ${(error as Error).message}`);
  }
};
