// actions/beams-today/removeFavorite.ts
"use server";

import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const removeFavorite = async (favoriteId: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    await db.beamsTodayFavorite.delete({
      where: {
        id: favoriteId,
        userId: user.id,
      },
    });
  } catch (error) {
    throw new Error(`Error removing favorite: ${(error as Error).message}`);
  }
};
