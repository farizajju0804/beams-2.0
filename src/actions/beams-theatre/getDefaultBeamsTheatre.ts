"use server";
import { db } from "@/libs/db";
import { BeamsTheatre, BeamsTheatreViewType } from "@/types/beamsTheatre";

export const getDefaultBeamsTheatre = async (): Promise<BeamsTheatre[]> => {
  try {
    const defaultTheatre = await db.beamsTheatre.findMany({
      where: { viewType: BeamsTheatreViewType.DEFAULT },
      include: {
        genre: true,
        episodes: true,
      },
    });

    if (defaultTheatre.length === 0) {
      throw new Error("No 'DEFAULT' content found");
    }

    // Calculate total time for episodes
    const calculateTotalTime = (theatre: any) => {
      return theatre.episodes.reduce((total: number, episode: any) => total + episode.durationInSeconds, 0);
    };

    const result = defaultTheatre.map(theatre => ({
      ...theatre,
      viewType: theatre.viewType as BeamsTheatreViewType, // Cast to your custom enum type
      totalTime: calculateTotalTime(theatre),
    }));

    return result;
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
