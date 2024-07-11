'use server';

import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const getNote = async (beamsTodayId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  const note = await db.beamsTodayUserNote.findFirst({
    where: {
      userId: user.id,
      beamsTodayId: beamsTodayId,
    },
  });

  return note;
};

export const saveNote = async (beamsTodayId: string, note: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  try {
    const existingNote = await db.beamsTodayUserNote.findFirst({
      where: {
        userId: user.id,
        beamsTodayId: beamsTodayId,
      },
    });

    if (existingNote) {
      await db.beamsTodayUserNote.update({
        where: { id: existingNote.id },
        data: { note },
      });
    } else {
      await db.beamsTodayUserNote.create({
        data: {
          userId: user.id,
          note,
          beamsTodayId: beamsTodayId,
        },
      });
    }
  } catch (error) {
    throw new Error(`Error saving note: ${(error as Error).message}`);
  }
};
