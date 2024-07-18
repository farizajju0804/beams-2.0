"use server";
import { db } from "@/libs/db";
import { BeamsTheatre, BeamsTheatreViewType } from "@/types/beamsTheatre";

export const getTrendingBeamsTheatre = async (): Promise<BeamsTheatre[]> => {
  try {
    const trending = await db.beamsTheatre.findMany({
      where: { viewType: BeamsTheatreViewType.TRENDING },
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
            description: true,
            url: true,
            thumbnailUrl: true,
            totalViews: true,
            totalWatchTime: true,
            durationInSeconds: true,
            beamsTheatreId: true,
            season: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      }
    });

    if (trending.length === 0) {
      throw new Error("No 'Trending' content found");
    }

    return trending as BeamsTheatre[];
  } catch (error) {
    throw new Error(`Error fetching 'Trending' content: ${(error as Error).message}`);
  }
};
