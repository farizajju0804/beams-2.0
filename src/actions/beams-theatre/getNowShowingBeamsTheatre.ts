"use server";
import { db } from "@/libs/db";
import { BeamsTheatre, BeamsTheatreViewType } from "@/types/beamsTheatre";

export const getNowShowingBeamsTheatre = async (): Promise<BeamsTheatre> => {
  try {
    const nowShowing = await db.beamsTheatre.findMany({
      where: { viewType: BeamsTheatreViewType.NOW_SHOWING },
      select: {
        id: true,
        title: true,
        description: true,
        posterUrl: true,
        genre: {
          select: {
            id: true,
            name: true,
          },
        },
        viewType: true,
        createdAt: true,
        updatedAt: true,
        totalViews: true,
        totalWatchTime: true,
        episodes: {
          select: {
            id: true,
            title: true,
            durationInSeconds: true,
            season: true,
          },
        },
      },
      take: 1 // Ensure only the first item is fetched
    });

    if (nowShowing.length === 0) {
      throw new Error("No 'Now Showing' content found");
    }

    return nowShowing[0] as BeamsTheatre;
  } catch (error) {
    throw new Error(`Error fetching 'Now Showing' content: ${(error as Error).message}`);
  }
};
