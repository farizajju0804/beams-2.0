// src/actions/beams-theatre/favoriteActions.ts

'use server';

import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const toggleFavoriteBeamsTheatre = async (beamsTheatreId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  const existingFavorite = await db.beamsTheatreFavorite.findUnique({
    where: {
      userId_beamsTheatreId: {
        userId: user.id,
        beamsTheatreId: beamsTheatreId,
      },
    },
  });

  if (existingFavorite) {
    await db.beamsTheatreFavorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
  } else {
    await db.beamsTheatreFavorite.create({
      data: {
        userId: user.id,
        beamsTheatreId: beamsTheatreId,
      },
    });
  }
};

export const isFavoriteBeamsTheatre = async (beamsTheatreId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return false;
  }

  const existingFavorite = await db.beamsTheatreFavorite.findUnique({
    where: {
      userId_beamsTheatreId: {
        userId: user.id,
        beamsTheatreId: beamsTheatreId,
      },
    },
  });

  return !!existingFavorite;
};
