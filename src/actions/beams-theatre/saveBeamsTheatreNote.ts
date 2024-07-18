'use server'
import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const getNote = async (beamsTheatreId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  const note = await db.beamsTheatreUserNote.findFirst({
    where: {
      userId: user.id,
      beamsTheatreId: beamsTheatreId,
    },
  });

  return note;
};

export const saveNote = async (beamsTheatreId: string, note: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  try {
    const existingNote = await db.beamsTheatreUserNote.findFirst({
      where: {
        userId: user.id,
        beamsTheatreId: beamsTheatreId,
      },
    });

    if (existingNote) {
      await db.beamsTheatreUserNote.update({
        where: { id: existingNote.id },
        data: { note },
      });
    } else {
      await db.beamsTheatreUserNote.create({
        data: {
          userId: user.id,
          note,
          beamsTheatreId: beamsTheatreId,
        },
      });
    }
  } catch (error) {
    throw new Error(`Error saving note: ${(error as Error).message}`);
  }
};
