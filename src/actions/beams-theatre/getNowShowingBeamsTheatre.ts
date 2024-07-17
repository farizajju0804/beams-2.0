"use server";
import { db } from "@/libs/db";
import { BeamsTheatreViewType } from "@/types/beamsTheatre";

export const getNowShowingBeamsTheatre = async () => {
  try {
    const nowShowing = await db.beamsTheatre.findMany({
      where: { viewType: BeamsTheatreViewType.NOW_SHOWING },
      include: {
        genre: true,
        seasons: {
          include: {
            episodes: true,
          },
        },
        episodes: true,
        favorites: true
      },
      take: 1 // Ensure only the first item is fetched
    });

    if (nowShowing.length === 0) {
      throw new Error("No 'Now Showing' content found");
    }

    return nowShowing[0];
  } catch (error) {
    throw new Error(`Error fetching 'Now Showing' content: ${(error as Error).message}`);
  }
};
