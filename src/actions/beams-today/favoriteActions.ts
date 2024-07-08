'use server';

import { db } from "@/libs/db";
import { currentUser } from "@/libs/auth";

export const toggleFavorite = async (beamsTodayId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error('User not authenticated or missing user ID');
  }

  const existingFavorite = await db.beamsTodayFavorite.findUnique({
    where: {
      userId_beamsTodayId: {
        userId: user.id,
        beamsTodayId: beamsTodayId,
      },
    },
  });

  if (existingFavorite) {
    await db.beamsTodayFavorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
  } else {
    await db.beamsTodayFavorite.create({
      data: {
        userId: user.id,
        beamsTodayId: beamsTodayId,
      },
    });
  }
};

export const isFavoriteBeamsToday = async (beamsTodayId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return false;
  }

  const existingFavorite = await db.beamsTodayFavorite.findUnique({
    where: {
      userId_beamsTodayId: {
        userId: user.id,
        beamsTodayId: beamsTodayId,
      },
    },
  });

  return !!existingFavorite;
};
