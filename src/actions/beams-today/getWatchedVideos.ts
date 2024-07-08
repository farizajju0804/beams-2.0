'use server'
import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const getWatchedVideos = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }

  const watchedVideosRecord = await db.beamsTodayWatchedContent.findUnique({
    where: {
      userId: user.id,
    },
  });

  return watchedVideosRecord?.watchedVideos || [];
};
