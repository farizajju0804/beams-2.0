"use server";
import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const getUserNotes = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    throw new Error("User not authenticated or missing user ID");
  }

  try {
    const notes = await db.beamsTodayUserNote.findMany({
      where: { userId: user.id },
      include: { beamsToday: true },
    });
    return notes;
  } catch (error) {
    throw new Error(`Error fetching user notes: ${(error as Error).message}`);
  }
};
