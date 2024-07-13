'use server'
import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";

export const updateWatchTime = async (beamsTodayId: string, watchTime: number, format: 'video' | 'audio' | 'text' = 'video') => {
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

    const roundedWatchTime = Math.round(watchTime);

    const beamsTodayUpdateData: any = {
      totalWatchTime: {
        increment: roundedWatchTime,
      },
    };

    if (format === 'video') {
      beamsTodayUpdateData.totalVideoWatchTime = { increment: roundedWatchTime };
    } else if (format === 'audio') {
      beamsTodayUpdateData.totalAudioListenTime = { increment: roundedWatchTime };
    } else if (format === 'text') {
      beamsTodayUpdateData.totalTextSpentTime = { increment: roundedWatchTime };
    }

    await db.beamsToday.update({
      where: { id: beamsTodayId },
      data: beamsTodayUpdateData,
    });

    let individualWatchTimesVideo: Record<string, number> = {};
    let individualWatchTimesAudio: Record<string, number> = {};
    let individualWatchTimesText: Record<string, number> = {};

    const userAnalytics = await db.beamsTodayUserAnalytics.findUnique({
      where: { userId },
    });

    if (userAnalytics) {
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

    const userAnalyticsUpdateData: any = {
      totalWatchTimeBeamsToday: { increment: roundedWatchTime },
      totalVideoWatchTime: format === 'video' ? { increment: roundedWatchTime } : undefined,
      totalAudioListenTime: format === 'audio' ? { increment: roundedWatchTime } : undefined,
      totalTextSpentTime: format === 'text' ? { increment: roundedWatchTime } : undefined,
      individualWatchTimesVideo: format === 'video' ? individualWatchTimesVideo : undefined,
      individualWatchTimesAudio: format === 'audio' ? individualWatchTimesAudio : undefined,
      individualWatchTimesText: format === 'text' ? individualWatchTimesText : undefined,
    };

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

    return "Watch time updated";
  } catch (error) {
    console.error(`Error updating watch time: ${(error as Error).message}`);
    throw error;
  }
};
