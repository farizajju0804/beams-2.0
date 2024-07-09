'use server'
import { db } from "@/libs/db";
export const updateViewCount = async (id: string) => {
  try {
    await db.beamsToday.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Failed to update view count:", error);
  }
};
