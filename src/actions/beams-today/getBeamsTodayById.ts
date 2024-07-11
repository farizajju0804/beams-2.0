"use server";
import { db } from "@/libs/db";

export const getBeamsTodayById = async (id: string) => {
  try {
    const video = await db.beamsToday.findUnique({
      where: { id: id },
      include: {
        category: true, // Include the related category
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    return video;
  } catch (error) {
    throw new Error(`Error fetching video: ${(error as Error).message}`);
  }
};
