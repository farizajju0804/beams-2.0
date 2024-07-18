"use server";
import { db } from "@/libs/db";
import { BeamsTheatreWithTotalTime, BeamsTheatreViewType } from "@/types/beamsTheatre";

export const getRelatedBeamsTheatre = async (genreId: string): Promise<BeamsTheatreWithTotalTime[]> => {
  try {
    const relatedTheatre = await db.beamsTheatre.findMany({
      where: { genreId },
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
      take : 6
    });

    const calculateTotalTime = (theatre: any) => {
      return theatre.episodes.reduce((total: number, episode: any) => total + episode.durationInSeconds, 0);
    };

    return relatedTheatre.map(theatre => ({
      ...theatre,
      totalTime: calculateTotalTime(theatre),
    })) as BeamsTheatreWithTotalTime[];
  } catch (error) {
    throw new Error(`Error fetching related content: ${(error as Error).message}`);
  }
};
