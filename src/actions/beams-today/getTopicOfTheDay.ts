"use server"
import { db } from "@/libs/db";

export const getTopicOfTheDay = async (clientDate: string) => {
  const today = new Date(clientDate);
  today.setUTCHours(0, 0, 0, 0);
 



  try {
    const video = await db.beamsToday.findUnique({
      where: { date: today },
    });
    return video;
  } catch (error) {
    throw new Error(`Error fetching video: ${(error as Error).message}`);
  }
};