"use server"
import { db } from '@/libs/db';
import { PointsSource } from '@prisma/client';

export const recordPointsHistory = async (userId: string, points: number, source: PointsSource, description: string) => {
    await db.beamPointsHistory.create({
      data: {
        userId,
        points,
        source,
        description,
      },
    });
  };
  