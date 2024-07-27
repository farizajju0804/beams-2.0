// actions/beams-today/getAllBeamsToday.ts
import { db } from "@/libs/db";

export const getAllBeamsToday = async () => {
  try {
    const videos = await db.beamsToday.findMany({
      orderBy: { date: 'asc' },
    });

    if (!videos) {
      throw new Error("No videos found");
    }

    return videos;
  } catch (error) {
    throw new Error(`Error fetching videos: ${(error as Error).message}`);
  }
};
