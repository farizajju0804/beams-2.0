"use server";
import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const getUserFavorites = async () => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User not authenticated or missing user ID");
  }

  try {
    const favorites = await db.beamsTodayFavorite.findMany({
      where: { userId: user.id },
      include: { beamsToday: true },
    });
    return favorites;
  } catch (error) {
    throw new Error(`Error fetching user favorites: ${(error as Error).message}`);
  }
};
