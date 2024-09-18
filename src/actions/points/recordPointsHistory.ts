"use server"
import { db } from '@/libs/db';

export const recordPointsHistory = async (userId: string, points: number, source: string, description: string) => {
    await db.beamPointsHistory.create({
      data: {
        userId,
        points,
        source,
        description,
      },
    });
  };
  