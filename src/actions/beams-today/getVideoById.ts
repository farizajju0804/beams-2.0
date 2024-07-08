"use server";

import { db } from "@/libs/db";

export const getVideoById = async (id: string) => {
  try {
    const video = await db.beamsToday.findUnique({
      where: { id: id },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    return video;
  } catch (error) {
    throw new Error(`Error fetching video: ${(error as Error).message}`);
  }
};
