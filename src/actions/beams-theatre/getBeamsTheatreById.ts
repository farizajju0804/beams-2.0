"use server";
import { db } from "@/libs/db";
import { BeamsTheatre } from "@/types/beamsTheatre";

export const getBeamsTheatreById = async (id: string): Promise<BeamsTheatre> => {
  try {
    const beamsTheatre = await db.beamsTheatre.findUnique({
      where: { id },
      include: {
        genre: true,
        episodes: true,
        favorites: true,
      },
    });

    if (!beamsTheatre) {
      throw new Error("Beams Theatre content not found");
    }

    return beamsTheatre as BeamsTheatre;
  } catch (error) {
    throw new Error(`Error fetching Beams Theatre content: ${(error as Error).message}`);
  }
};
