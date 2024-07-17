"use server";
import { db } from "@/libs/db";
import { BeamsTheatreViewType, BeamsTheatreStructure } from "@/types/beamsTheatre";

export const getDefaultBeamsTheatre = async () => {
  try {
    const defaultTheatre = await db.beamsTheatre.findMany({
      where: { viewType: BeamsTheatreViewType.DEFAULT },
      include: {
        genre: true,
        seasons: {
          include: {
            episodes: true,
          },
        },
        episodes: true,
        favorites: true,
      },
    });

    if (!defaultTheatre) {
      throw new Error("No 'DEFAULT' content found");
    }

    // Calculate total time for episodes
    const calculateTotalTime = (theatre: any) => {
      if (theatre.structure === BeamsTheatreStructure.SINGLE_VIDEO) {
        return theatre.episodes.reduce((total: number, episode: any) => total + episode.durationInSeconds, 0);
      } else {
        return theatre.seasons.reduce((total: number, season: any) => {
          return total + season.episodes.reduce((seasonTotal: number, episode: any) => seasonTotal + episode.durationInSeconds, 0);
        }, 0);
      }
    };

    return defaultTheatre.map(theatre => ({
      ...theatre,
      totalTime: calculateTotalTime(theatre),
    }));
  } catch (error) {
    throw new Error(`Error fetching 'DEFAULT' content: ${(error as Error).message}`);
  }
};

export const getGenres = async () => {
  try {
    const genres = await db.beamsTheatreGenre.findMany();
    return genres;
  } catch (error) {
    throw new Error(`Error fetching genres: ${(error as Error).message}`);
  }
};
