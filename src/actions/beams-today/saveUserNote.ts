'use server';

import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const saveNote = async (videoId: string, note: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  try {
    await db.beamsTodayUserNote.create({
      data: {
        userId: user.id, 
        note,
        beamsTodayId: videoId,
      },
    });
  } catch (error) {
    throw new Error(`Error saving note: ${(error as Error).message}`);
  }
};
