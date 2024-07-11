"use server";
import { db } from "@/libs/db";

export const getRecentUploads = async (clientDate: string) => {
  const today = new Date(clientDate);
  try {
    const recentVideos = await db.beamsToday.findMany({
      where: {
        date: {
          lt: today
        }
      },
      orderBy: {
        date: 'desc'
      },
      select: {
        id: true,
        thumbnailUrl: true,
        title: true,
        date: true,
        category: true,
      }
    });

    return recentVideos;
  } catch (error) {
    throw new Error(`Error fetching recent uploads: ${(error as Error).message}`);
  }
};
