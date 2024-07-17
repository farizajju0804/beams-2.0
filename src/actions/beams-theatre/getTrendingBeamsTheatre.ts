"use server";
import { db } from "@/libs/db";
import { BeamsTheatreViewType } from "@/types/beamsTheatre";

export const getTrendingBeamsTheatre = async () => {
  try {
    const trending = await db.beamsTheatre.findMany({
      where: { viewType: BeamsTheatreViewType.TRENDING },
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

    if (!trending) {
      throw new Error("No 'TRENDING' content found");
    }

    return trending;
  } catch (error) {
    throw new Error(`Error fetching 'TRENDING' content: ${(error as Error).message}`);
  }
};
