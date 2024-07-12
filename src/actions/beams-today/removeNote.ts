// actions/beams-today/removeNote.ts
"use server";

import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const removeNote = async (noteId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    await db.beamsTodayUserNote.delete({
      where: {
        id: noteId,
        userId: user.id,
      },
    });
  } catch (error) {
    throw new Error(`Error removing note: ${(error as Error).message}`);
  }
};
